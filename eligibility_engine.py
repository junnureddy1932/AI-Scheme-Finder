from typing import Dict, Any, List, Tuple
from app.models import Scheme, UserProfile

# Income range string parser to conservative numerical estimates
INCOME_RANGE_MAP = {
    "Below 1 Lakh": 100000,
    "1-2.5 Lakh": 250000,
    "2.5-5 Lakh": 500000,
    "5-8 Lakh": 800000,
    "Above 8 Lakh": 1200000,
}

def evaluate_scheme_eligibility(scheme: Scheme, profile: UserProfile) -> Dict[str, Any]:
    """
    Deterministically evaluates a user profile against a government scheme's eligibility rules.
    Does NOT hallucinate or guess official outcomes.
    
    Returns:
        status: "Likely eligible" | "Possibly eligible" | "Not eligible" | "Insufficient information"
        relevance_score: float (0 - 100, labeled as internal relevance score)
        matched_criteria: List[str]
        failed_criteria: List[str]
        missing_fields: List[str]
        summary_explanation: str
    """
    rules: Dict[str, Any] = scheme.eligibility_rules or {}
    matched: List[str] = []
    failed: List[str] = []
    missing: List[str] = []
    
    # 1. State Scope Check
    scheme_state = scheme.state_scope
    if scheme_state not in ["All-India", "Central", "National"]:
        if profile.state:
            if profile.state.lower() == scheme_state.lower() or scheme_state.lower() in profile.state.lower():
                matched.append(f"Resident of eligible state ({profile.state})")
            else:
                failed.append(f"Scheme is restricted to residents of {scheme_state}; profile lists {profile.state}")
        else:
            missing.append("State of residence")

    # 2. Age Criteria Check
    min_age = rules.get("min_age")
    max_age = rules.get("max_age")
    if min_age is not None or max_age is not None:
        if profile.age is not None:
            if min_age is not None and profile.age < min_age:
                failed.append(f"Age is below minimum requirement of {min_age} years (Current age: {profile.age})")
            elif max_age is not None and profile.age > max_age:
                failed.append(f"Age exceeds maximum limit of {max_age} years (Current age: {profile.age})")
            else:
                matched.append(f"Age ({profile.age} years) falls within required range ({min_age or 0} - {max_age or 'No upper limit'})")
        else:
            missing.append("Age")

    # 3. Income Cap Check
    max_income = rules.get("max_annual_income")
    if max_income is not None:
        user_income = profile.annual_income
        if user_income is None and profile.income_range:
            user_income = INCOME_RANGE_MAP.get(profile.income_range)
            
        if user_income is not None:
            if user_income > max_income:
                failed.append(f"Household income (₹{user_income:,.0f}) exceeds scheme ceiling of ₹{max_income:,.0f}")
            else:
                matched.append(f"Household income is within the required ceiling of ₹{max_income:,.0f}")
        else:
            missing.append("Household annual income")

    # 4. Gender Check
    eligible_genders = [g.lower() for g in rules.get("eligible_genders", ["any"])]
    if "any" not in eligible_genders and "all" not in eligible_genders:
        if profile.gender:
            if profile.gender.lower() in eligible_genders:
                matched.append(f"Gender criteria met ({profile.gender.capitalize()})")
            else:
                failed.append(f"Scheme is exclusively for {', '.join(eligible_genders).capitalize()}; profile lists {profile.gender.capitalize()}")
        else:
            missing.append("Gender")

    # 5. Farmer Status / Landholding Check
    requires_farmer = rules.get("requires_farmer", False)
    requires_land = rules.get("requires_agricultural_land", False)
    if requires_farmer or requires_land:
        is_farmer = profile.is_farmer or (profile.occupation and "farmer" in profile.occupation.lower())
        has_land = profile.has_agricultural_land
        
        if requires_farmer:
            if is_farmer:
                matched.append("Registered agricultural producer / farmer profile")
            elif profile.occupation and "farmer" not in profile.occupation.lower():
                failed.append("Scheme requires primary agricultural occupation")
            else:
                missing.append("Farmer status verification")
                
        if requires_land:
            if has_land:
                matched.append("Cultivable agricultural landholder")
            elif has_land is False:
                failed.append("Requires verified agricultural landholding")
            else:
                missing.append("Agricultural land ownership record")

    # 6. Student & Education Status Check
    requires_student = rules.get("requires_student", False)
    if requires_student:
        is_student = profile.is_student or (profile.occupation and "student" in profile.occupation.lower())
        if is_student:
            matched.append("Enrolled student status satisfied")
        elif profile.occupation and "student" not in profile.occupation.lower():
            failed.append("Requires active enrolment as a student")
        else:
            missing.append("Student enrolment status")

    eligible_education = rules.get("eligible_education", [])
    if eligible_education and "Any" not in eligible_education and "All" not in eligible_education:
        if profile.education_level:
            if any(edu.lower() in profile.education_level.lower() for edu in eligible_education):
                matched.append(f"Education level matches ({profile.education_level})")
            else:
                failed.append(f"Required education: {', '.join(eligible_education)}; profile has {profile.education_level}")
        else:
            missing.append("Education level")

    # 7. Differently Abled Check
    requires_pwd = rules.get("requires_differently_abled", False)
    if requires_pwd:
        if profile.is_differently_abled:
            matched.append("Persons with Disabilities (PwD) requirement met")
        elif profile.is_differently_abled is False:
            failed.append("Designated specifically for Persons with Disabilities (PwD)")
        else:
            missing.append("Disability / PwD status")

    # 8. Social Category Check (Caste / EWS)
    eligible_categories = rules.get("eligible_categories", ["Any"])
    if eligible_categories and "Any" not in eligible_categories and "All" not in eligible_categories:
        if profile.social_category:
            if profile.social_category.upper() in [c.upper() for c in eligible_categories]:
                matched.append(f"Social category eligible ({profile.social_category})")
            else:
                failed.append(f"Category restricted to {', '.join(eligible_categories)}; profile has {profile.social_category}")
        else:
            missing.append("Social category (OBC/SC/ST/EWS)")

    # 9. Determine Status & Relevance Score
    special_conditions = rules.get("special_conditions", [])
    
    if len(failed) > 0:
        status = "Not eligible"
        relevance_score = max(10.0, 30.0 - (len(failed) * 8.0))
        summary = f"Currently not eligible due to {len(failed)} condition(s): " + "; ".join(failed[:2])
    elif len(missing) >= 2:
        status = "Insufficient information"
        relevance_score = 45.0 + min(len(matched) * 8.0, 20.0)
        summary = f"Additional profile information needed to confirm: {', '.join(missing[:3])}"
    elif len(missing) == 1:
        status = "Possibly eligible"
        relevance_score = 65.0 + min(len(matched) * 7.0, 20.0)
        summary = f"Likely match pending confirmation of {missing[0]}."
    elif special_conditions:
        status = "Possibly eligible"
        relevance_score = 78.0 + min(len(matched) * 4.0, 15.0)
        summary = f"All core demographic criteria satisfied. Requires specific verification: {special_conditions[0]}"
    else:
        status = "Likely eligible"
        relevance_score = 90.0 + min(len(matched) * 2.0, 10.0)
        summary = "All evaluated demographic, state, and income criteria are fully satisfied."

    relevance_score = min(99.0, max(5.0, round(relevance_score, 1)))

    return {
        "eligibility_status": status,
        "relevance_score": relevance_score,
        "matched_criteria": matched,
        "failed_criteria": failed,
        "missing_fields": missing,
        "summary_explanation": summary,
        "official_application_url": scheme.application_url,
        "verification_date": scheme.last_verified_at.strftime("%d %b %Y")
    }
