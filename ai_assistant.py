import re
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import Scheme, UserProfile
from app.config import settings

def search_relevant_schemes(query: str, db: Session, limit: int = 4) -> List[Scheme]:
    """Retrieve schemes matching keyword tokens in query."""
    tokens = [t.lower().strip() for t in re.split(r'\W+', query) if len(t) > 2]
    all_schemes = db.query(Scheme).filter(Scheme.is_active == True).all()
    
    scored: List[tuple[int, Scheme]] = []
    category_keywords = {
        "scholarship": ["scholarship", "education", "student", "college", "school", "matric", "post-matric"],
        "agriculture": ["farmer", "farming", "agriculture", "crop", "land", "kisan", "rythu"],
        "healthcare": ["health", "hospital", "medical", "treatment", "ayushman", "arogyasri", "bima"],
        "housing": ["house", "housing", "awas", "home", "shelter"],
        "women & child": ["women", "woman", "girl", "mother", "child", "sukanya", "maternity"],
        "pensions": ["pension", "old age", "senior", "retirement", "atal", "maan-dhan"],
        "employment": ["employment", "job", "skill", "training", "mudra", "loan", "entrepreneur", "business"]
    }
    
    for scheme in all_schemes:
        score = 0
        text_corpus = f"{scheme.name} {scheme.category} {scheme.description} {scheme.benefit_description} {scheme.department} {scheme.state_scope}".lower()
        
        # Exact acronym or slug match
        scheme_slug_clean = scheme.slug.replace("-", " ")
        if scheme.slug in query.lower() or scheme_slug_clean in query.lower():
            score += 25
            
        # Match tokens
        for token in tokens:
            if token in scheme.slug.lower():
                score += 8
            elif token in scheme.name.lower():
                score += 6
            elif token in text_corpus:
                score += 2
                
        # Category semantic boost
        for cat, keywords in category_keywords.items():
            if cat.lower() in scheme.category.lower():
                for kw in keywords:
                    if kw in query.lower():
                        score += 5
                        
        # State match boost
        if scheme.state_scope.lower() in query.lower():
            score += 6
            
        scored.append((score, scheme))
        
    scored.sort(key=lambda x: x[0], reverse=True)
    # Return top matches with score > 0, or default first few if no match
    top = [s for score, s in scored if score > 0][:limit]
    if not top:
        top = all_schemes[:limit]
    return top


async def generate_chat_response(
    message: str,
    db: Session,
    user_profile: Optional[UserProfile] = None,
    language: str = "en"
) -> Dict[str, Any]:
    """
    Generate conversational answer grounded in verified government scheme records.
    Uses LLM API if GEMINI_API_KEY / OPENAI_API_KEY is configured,
    otherwise uses high-accuracy rule-grounded response synthesis.
    """
    relevant_schemes = search_relevant_schemes(message, db, limit=3)
    user_q = message.lower()
    
    # Check if external LLM API is configured
    if settings.GEMINI_API_KEY:
        try:
            import httpx
            # Prepare grounded prompt
            grounding_context = "\n\n".join([
                f"SCHEME: {s.name}\nDepartment: {s.department}\nCategory: {s.category}\nState Scope: {s.state_scope}\nBenefits: {s.benefit_description}\nEligibility: {s.eligibility_rules}\nRequired Documents: {', '.join(s.required_documents)}\nApplication Portal: {s.application_url}\nOfficial Website: {s.official_url}"
                for s in relevant_schemes
            ])
            
            profile_info = "Not provided"
            if user_profile:
                profile_info = f"Age: {user_profile.age}, State: {user_profile.state}, Occupation: {user_profile.occupation}, Education: {user_profile.education_level}, Income Range: {user_profile.income_range}"
                
            system_instruction = (
                "You are JanSahayak AI, an empathetic and accurate Indian government welfare assistant. "
                "Base your response ONLY on the provided verified schemes. Never hallucinate or invent eligibility rules. "
                "Explain eligibility simply and clearly. Provide official URLs. "
                "If the user is asking about specific criteria that are missing from their profile, gently suggest what information would clarify their eligibility. "
                f"Respond in {'Telugu (తెలుగు)' if language == 'te' else 'English'}."
            )
            
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": f"{system_instruction}\n\nUSER PROFILE: {profile_info}\n\nVERIFIED SCHEMES:\n{grounding_context}\n\nUSER QUESTION: {message}"}]}
                ]
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(gemini_url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    answer_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {
                        "answer": answer_text,
                        "cited_schemes": relevant_schemes,
                        "follow_up_suggestions": [
                            "What documents do I need to prepare?",
                            "How do I apply on the official portal?",
                            "Are there state-specific schemes for my region?"
                        ]
                    }
        except Exception as e:
            # Fall back to grounded synthesis if network/key error
            pass

    # High-accuracy Grounded Deterministic Fallback Engine
    is_te = (language == "te")
    follow_ups = []
    
    if not relevant_schemes:
        if is_te:
            answer = "క్షమించండి, మీ ప్రశ్నతో సరిపోలే ప్రభుత్వ పథకాలు మా ధృవీకరించబడిన డేటాబేస్‌లో కనుగొనబడలేదు. దయచేసి మరింత సమాచారాన్ని (ఉదా. విద్యార్థి, రైతు, లేదా మీ రాష్ట్రం) చేర్చి మళ్లీ ప్రయత్నించండి."
        else:
            answer = "I could not find matching verified schemes in our current catalog for that specific query. Please try searching for a category such as Scholarships, Agriculture, Housing, Healthcare, or specify your State."
        return {
            "answer": answer,
            "cited_schemes": [],
            "follow_up_suggestions": [
                "Which scholarships are available for students?",
                "What subsidies are available for small farmers?",
                "Which health insurance schemes can I apply for?"
            ]
        }

    # Synthesize grounded answer
    primary = relevant_schemes[0]
    
    if "document" in user_q or "doc" in user_q or "పత్రాలు" in user_q:
        docs_list = "\n".join([f"• {doc}" for doc in primary.required_documents])
        if is_te:
            answer = (
                f"**{primary.name_te or primary.name}** కోసం అవసరమైన ముఖ్యమైన అధికారిక పత్రాలు:\n\n"
                f"{docs_list}\n\n"
                f"అధికారిక పోర్టల్ ద్వారా దరఖాస్తు చేసుకోవడానికి [ఇక్కడ క్లిక్ చేయండి]({primary.application_url}). "
                f"గమనిక: ఈ పత్రాలు సంబంధిత ప్రభుత్వ శాఖ మార్గదర్శకాల ప్రకారం తప్పనిసరి."
            )
        else:
            answer = (
                f"Here are the verified document requirements for **{primary.name}** "
                f"(administered by {primary.department}):\n\n"
                f"{docs_list}\n\n"
                f"💡 **Next Steps**: You can verify your application prerequisites and apply directly through the official portal: [Official Portal Link]({primary.application_url})."
            )
        follow_ups = [
            f"What is the eligibility criteria for {primary.name}?",
            "What is the application deadline?",
            "Where do I submit these documents?"
        ]
    elif "apply" in user_q or "how to" in user_q or "portal" in user_q or "దరఖాస్తు" in user_q:
        if is_te:
            answer = (
                f"**{primary.name_te or primary.name}** కోసం దరఖాస్తు విధానం:\n\n"
                f"1. అధికారిక పోర్టల్ ను సందర్శించండి: [{primary.application_url}]({primary.application_url})\n"
                f"2. మీ ఆధార్ మరియు అవసరమైన వివరాలతో లాగిన్ అవ్వండి.\n"
                f"3. అవసరమైన పత్రాలను సమర్పించండి.\n"
                f"4. అధికారిక వెబ్‌సైట్: [{primary.official_url}]({primary.official_url})\n\n"
                f"⚠️ జనసహాయక్ AI ఎటువంటి దరఖాస్తు ఫీజులు లేదా మీ అధికారిక పాస్‌వర్డ్‌లను అడగదు. నేరుగా ప్రభుత్వ పోర్టల్ లోనే దరఖాస్తు చేసుకోండి."
            )
        else:
            answer = (
                f"Here is how you can apply for **{primary.name}**:\n\n"
                f"1. **Official Portal**: Navigate to the verified application portal at [{primary.application_url}]({primary.application_url}).\n"
                f"2. **Prerequisites**: Ensure you have verified documents ready: {', '.join(primary.required_documents[:3])}.\n"
                f"3. **Department**: Administered officially under **{primary.department}** ({primary.government_level} Government).\n"
                f"4. **Verification**: Always double check deadlines and guidelines on the official site: [{primary.official_url}]({primary.official_url}).\n\n"
                f"🛡️ *Security Tip: Never share OTPs or login credentials. Always apply directly on verified `.gov.in` or `.nic.in` domains.*"
            )
        follow_ups = [
            f"What documents do I need for {primary.name}?",
            "Am I eligible based on my income?",
            "Can I track my application status?"
        ]
    else:
        # General scheme discovery & matching answer
        schemes_summary = "\n\n".join([
            f"**{i+1}. {s.name_te if is_te and s.name_te else s.name}** ({s.state_scope})\n"
            f"• **{('ప్రయోజనం' if is_te else 'Benefit')}**: {s.benefit_description_te if is_te and s.benefit_description_te else s.benefit_description}\n"
            f"• **{('శాఖ' if is_te else 'Department')}**: {s.department}\n"
            f"• **{('పోర్టల్' if is_te else 'Official Portal')}**: [{s.application_url}]({s.application_url})"
            for i, s in enumerate(relevant_schemes)
        ])
        
        if is_te:
            answer = (
                f"మీ విచారణకు సంబంధించిన ముఖ్యమైన ప్రభుత్వ పథకాలు ఇక్కడ ఉన్నాయి:\n\n"
                f"{schemes_summary}\n\n"
                f"మీ పూర్తి అర్హతను తనిఖీ చేయడానికి, మీ ప్రొఫైల్ లో వయస్సు, రాష్ట్రం మరియు వార్షిక ఆదాయాన్ని నమోదు చేయండి."
            )
        else:
            answer = (
                f"Based on verified government records, here are the most relevant welfare schemes for your query:\n\n"
                f"{schemes_summary}\n\n"
                f"📌 **Eligibility Note**: Each scheme evaluates specific conditions such as household income limits, state residency, and occupational status. You can view your detailed personalized eligibility report on the Dashboard or Schemes tab."
            )
        follow_ups = [
            "What documents are required to apply?",
            "How do I submit an application online?",
            "Are there any income restrictions?"
        ]

    # If profile is missing critical details, suggest adding them
    if not user_profile or not user_profile.state or not user_profile.income_range:
        if is_te:
            answer += "\n\n💡 *చిట్కా: మీ రాష్ట్రం మరియు వార్షిక ఆదాయాన్ని మీ ప్రొఫైల్‌లో అప్‌డేట్ చేయడం ద్వారా మరింత ఖచ్చితమైన ఫలితాలు పొందవచ్చు.*"
        else:
            answer += "\n\n💡 *Helpful Tip: To get definitive eligibility matching, complete your State and Household Income range in your profile.*"

    return {
        "answer": answer,
        "cited_schemes": relevant_schemes,
        "follow_up_suggestions": follow_ups
    }
