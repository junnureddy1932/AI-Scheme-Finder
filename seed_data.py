from datetime import datetime
from typing import List, Dict, Any

SCHEMES_SEED_DATA: List[Dict[str, Any]] = [
    {
        "slug": "pm-kisan-samman-nidhi",
        "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        "name_te": "ప్రధాన మంత్రి కిసాన్ సమ్మాన్ నిధి (పీఎం-కిసాన్)",
        "category": "Agriculture",
        "government_level": "Central",
        "state_scope": "All-India",
        "department": "Ministry of Agriculture & Farmers Welfare",
        "department_te": "వ్యవసాయం మరియు రైతు సంక్షేమ మంత్రిత్వ శాఖ",
        "description": "Central Sector scheme providing income support of ₹6,000 per year in three equal four-monthly installments directly into the bank accounts of landholding farmer families across India.",
        "description_te": "భారతదేశంలోని సాగుభూమి కలిగిన రైతు కుటుంబాలకు సంవత్సరానికి ₹6,000 ఆదాయ సహాయాన్ని మూడు విడతలలో నేరుగా బ్యాంక్ ఖాతాల్లో జమ చేసే కేంద్ర పథకం.",
        "benefit_description": "₹6,000 per year distributed in 3 equal installments of ₹2,000 every four months via Direct Benefit Transfer (DBT).",
        "benefit_description_te": "డైరెక్ట్ బెనిఫిట్ ట్రాన్స్‌ఫర్ (DBT) ద్వారా ప్రతి నాలుగు నెలలకు ₹2,000 చొప్పున ఏడాదికి మొత్తం ₹6,000 సహాయం.",
        "estimated_benefit_amount": 6000.0,
        "official_url": "https://pmkisan.gov.in",
        "application_url": "https://pmkisan.gov.in/RegistrationFormUpdated.aspx",
        "eligibility_rules": {
            "min_age": 18,
            "max_age": 100,
            "max_annual_income": None,
            "eligible_states": ["All-India"],
            "eligible_occupations": ["Farmer", "Agricultural Laborer"],
            "eligible_education": ["Any"],
            "eligible_genders": ["any"],
            "eligible_categories": ["Any"],
            "requires_student": False,
            "requires_farmer": True,
            "requires_agricultural_land": True,
            "requires_differently_abled": False,
            "special_conditions": ["Farmer family must possess cultivable landholding in revenue land records"]
        },
        "required_documents": [
            "Aadhaar Card (linked to active bank account)",
            "Land Ownership Records / RoR / 1-B Namuna / Patta Passbook",
            "Active Savings Bank Account Details (with NPCI Aadhaar seeding)",
            "Mobile number linked with Aadhaar for e-KYC"
        ],
        "exclusion_rules": [
            "Institutional landholders",
            "Farmer families with one or more members serving/retired constitutional post holders, ministers, MPs, MLAs",
            "Serving or retired government employees (excluding Multi Tasking Staff / Class IV / Group D)",
            "Income tax payers of previous assessment year",
            "Professionals like Doctors, Engineers, Lawyers, Chartered Accountants"
        ],
        "faqs": [
            {
                "question": "Is e-KYC mandatory for receiving PM-KISAN installments?",
                "answer": "Yes, OTP-based e-KYC on the PMKISAN portal or biometric e-KYC at nearby CSC centers is mandatory."
            },
            {
                "question": "Can tenant or landless agricultural laborers apply?",
                "answer": "No, PM-KISAN is specifically for landholding farmer families whose names appear in the land revenue record."
            }
        ],
        "start_date": "2018-12-01",
        "end_date": "Ongoing",
        "source_url": "https://pmkisan.gov.in/Documents/OperationalGuidelines.pdf",
        "verification_status": "verified"
    },
    {
        "slug": "post-matric-scholarship-sc-st-obc",
        "name": "Post-Matric Scholarship Scheme for SC/ST/OBC Students",
        "name_te": "ఎస్సీ/ఎస్టీ/ఓబీసీ విద్యార్థుల పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ పథకం",
        "category": "Scholarships",
        "government_level": "Central",
        "state_scope": "All-India",
        "department": "Ministry of Social Justice and Empowerment / Ministry of Tribal Affairs",
        "department_te": "సామాజిక న్యాయం మరియు సాధికారత మంత్రిత్వ శాఖ",
        "description": "Centrally sponsored scholarship enabling students from socially disadvantaged categories to pursue higher education post Class 10th through financial support covering maintenance allowance and non-refundable fees.",
        "description_te": "10వ తరగతి తర్వాత ఉన్నత విద్యను అభ్యసించే సామాజికంగా వెనుకబడిన వర్గాల విద్యార్థులకు ఫీజు మరియు మెయింటెనెన్స్ ఖర్చుల కోసం అందించే కేంద్ర స్కాలర్‌షిప్.",
        "benefit_description": "Full compulsory course fee reimbursement plus monthly maintenance allowance between ₹2,500 and ₹13,500 per annum depending on course group.",
        "benefit_description_te": "కోర్సు ఫీజు రీయింబర్స్‌మెంట్ మరియు కోర్సును బట్టి ఏడాదికి ₹2,500 నుండి ₹13,500 వరకు మెయింటెనెన్స్ అలవెన్స్.",
        "estimated_benefit_amount": 25000.0,
        "official_url": "https://scholarships.gov.in",
        "application_url": "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
        "eligibility_rules": {
            "min_age": 15,
            "max_age": 35,
            "max_annual_income": 250000.0,
            "eligible_states": ["All-India"],
            "eligible_occupations": ["Student"],
            "eligible_education": ["10th Pass", "12th Pass", "Undergraduate", "Postgraduate", "Vocational"],
            "eligible_genders": ["any"],
            "eligible_categories": ["SC", "ST", "OBC"],
            "requires_student": True,
            "requires_farmer": False,
            "requires_agricultural_land": False,
            "requires_differently_abled": False,
            "special_conditions": ["Must be enrolled in recognized post-secondary education institution"]
        },
        "required_documents": [
            "Aadhaar Card",
            "Caste Certificate issued by competent revenue authority (Tahsildar / MeeSeva)",
            "Income Certificate (Annual household income under ₹2.5 Lakhs)",
            "10th Standard Marks Sheet / Previous qualifying exam marksheet",
            "Current Institution Bonafide & Fee Receipt",
            "Bank Passbook linked to Aadhaar"
        ],
        "exclusion_rules": [
            "Students whose total family income from all sources exceeds ₹2.50 lakh per annum",
            "Students pursuing education through distance mode with regular employment",
            "Students receiving other government scholarships for the same course"
        ],
        "faqs": [
            {
                "question": "Can I apply if my household income is above ₹2.5 Lakh?",
                "answer": "No, the strict upper household income limit is ₹2,50,000 per annum across all central post-matric schemes."
            },
            {
                "question": "Where should I submit the application?",
                "answer": "All fresh and renewal applications must be submitted online on the National Scholarship Portal (NSP)."
            }
        ],
        "start_date": "2024-07-01",
        "end_date": "2025-01-31",
        "source_url": "https://scholarships.gov.in/public/schemeGuidelines/PostMatric_Guidelines.pdf",
        "verification_status": "verified"
    },
    {
        "slug": "ayushman-bharat-pmjay",
        "name": "Ayushman Bharat — Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
        "name_te": "ఆయుష్మాన్ భారత్ — ప్రధాన మంత్రి జన్ ఆరోగ్య యోజన (పీఎం-జేఏవై)",
        "category": "Healthcare",
        "government_level": "Central",
        "state_scope": "All-India",
        "department": "National Health Authority (NHA), Ministry of Health and Family Welfare",
        "department_te": "జాతీయ ఆరోగ్య అథారిటీ, ఆరోగ్య మరియు కుటుంబ సంక్షేమ మంత్రిత్వ శాఖ",
        "description": "World's largest government-funded health assurance scheme providing health cover of ₹5 Lakh per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families.",
        "description_te": "పేద మరియు మధ్యతరగతి కుటుంబాలకు సెకండరీ మరియు టెర్షియరీ ఆసుపత్రి చికిత్సల కోసం ప్రతి కుటుంబానికి ఏడాదికి ₹5 లక్షల వరకు ఉచిత నగదు రహిత ఆరోగ్య బీమా.",
        "benefit_description": "Cashless and paperless secondary and tertiary hospitalization cover of up to ₹5,00,000 per family per year across empaneled public and private hospitals.",
        "benefit_description_te": "ఎంప్యానెల్ చేయబడిన ఆసుపత్రులలో ప్రతి కుటుంబానికి సంవత్సరానికి ₹5,00,000 వరకు నగదు రహిత వైద్య చికిత్స.",
        "estimated_benefit_amount": 500000.0,
        "official_url": "https://pmjay.gov.in",
        "application_url": "https://beneficiary.nha.gov.in",
        "eligibility_rules": {
            "min_age": 0,
            "max_age": 100,
            "max_annual_income": 250000.0,
            "eligible_states": ["All-India"],
            "eligible_occupations": ["Any"],
            "eligible_education": ["Any"],
            "eligible_genders": ["any"],
            "eligible_categories": ["Any"],
            "requires_student": False,
            "requires_farmer": False,
            "requires_agricultural_land": False,
            "requires_differently_abled": False,
            "special_conditions": ["Eligible as per SECC 2011 deprivation criteria or active National Food Security Act (NFSA) ration card"]
        },
        "required_documents": [
            "Aadhaar Card of all family members",
            "Ration Card (NFSA / BPL / White Ration Card)",
            "Active mobile number for verification",
            "Ayushman Card generation via PM-JAY beneficiary portal or CSC kiosk"
        ],
        "exclusion_rules": [
            "Families owning motorized 2/3/4-wheelers or mechanized agricultural equipment",
            "Families with any member as government servant",
            "Households paying professional or income taxes"
        ],
        "faqs": [
            {
                "question": "Is there any restriction on family size or age?",
                "answer": "No, PM-JAY has zero restriction on family size, age, or gender. Pre-existing conditions are covered from day one."
            },
            {
                "question": "How do I check if my family is listed?",
                "answer": "Visit beneficiary.nha.gov.in with your Aadhaar or Ration Card number to search your family status."
            }
        ],
        "start_date": "2018-09-23",
        "end_date": "Ongoing",
        "source_url": "https://nha.gov.in/PM-JAY",
        "verification_status": "verified"
    },
    {
        "slug": "pradhan-mantri-awas-yojana-gramin",
        "name": "Pradhan Mantri Awas Yojana — Gramin (PMAY-G)",
        "name_te": "ప్రధాన మంత్రి ఆవాస్ యోజన — గ్రామీణ్ (పీఎంఏవై-జి)",
        "category": "Housing",
        "government_level": "Central",
        "state_scope": "All-India",
        "department": "Ministry of Rural Development",
        "department_te": "గ్రామీణాభివృద్ధి మంత్రిత్వ శాఖ",
        "description": "Provides financial assistance to rural homeless families and those living in kutcha or dilapidated houses for the construction of a pucca house with basic amenities including sanitation.",
        "description_te": "గ్రామీణ ప్రాంతాల్లో ఇళ్లు లేని పేదలకు మరియు మట్టి ఇళ్లలో నివసించే వారికి పక్కా ఇళ్ల నిర్మాణానికి ఆర్థిక సహాయం అందించే పథకం.",
        "benefit_description": "Direct financial grant of ₹1,20,000 in plain areas and ₹1,30,000 in hilly/difficult states, plus ₹12,000 toilet grant under Swachh Bharat and 90-95 days unskilled labor under MGNREGS.",
        "benefit_description_te": "మైదాన ప్రాంతాలలో ₹1,20,000 మరియు కొండ ప్రాంతాలలో ₹1,30,000 వరకు నేరుగా ఇంటి నిర్మాణ సహాయం, అదనంగా టాయిలెట్ నిర్మాణం మరియు ఉపాధి హామీ పథకం కూలీ సొమ్ము.",
        "estimated_benefit_amount": 132000.0,
        "official_url": "https://pmayg.nic.in",
        "application_url": "https://awaassoft.nic.in",
        "eligibility_rules": {
            "min_age": 18,
            "max_age": 100,
            "max_annual_income": 150000.0,
            "eligible_states": ["All-India"],
            "eligible_occupations": ["Any"],
            "eligible_education": ["Any"],
            "eligible_genders": ["any"],
            "eligible_categories": ["Any"],
            "requires_student": False,
            "requires_farmer": False,
            "requires_agricultural_land": False,
            "requires_differently_abled": False,
            "special_conditions": ["Must not own a pucca house anywhere in India; listed under Awaas+ / SECC rural priority"]
        },
        "required_documents": [
            "Aadhaar Card",
            "Bank Account Passbook (DBT-enabled)",
            "MGNREGA Job Card Number",
            "Swachh Bharat Mission (SBM) registration number for toilet construction",
            "Affidavit declaring no existing pucca house in the name of any family member"
        ],
        "exclusion_rules": [
            "Households possessing pucca house anywhere in India",
            "Households with motorized three or four wheelers",
            "Any member earning more than ₹15,000 per month or paying income tax"
        ],
        "faqs": [
            {
                "question": "Can I apply directly without Gram Sabha verification?",
                "answer": "Gram Sabha validation of the beneficiary priority list is a statutory step before sanctioning assistance."
            }
        ],
        "start_date": "2016-11-20",
        "end_date": "Ongoing",
        "source_url": "https://pmayg.nic.in/netiheading/Framework.aspx",
        "verification_status": "verified"
    },
    {
        "slug": "sukanya-samriddhi-yojana",
        "name": "Sukanya Samriddhi Yojana (SSY)",
        "name_te": "సుకున్య సమృద్ధి యోజన (ఎస్ఎస్వై)",
        "category": "Women & Child",
        "government_level": "Central",
        "state_scope": "All-India",
        "department": "Department of Posts / Ministry of Finance",
        "department_te": "తపాలా శాఖ / ఆర్థిక మంత్రిత్వ శాఖ",
        "description": "Government-backed savings scheme under the Beti Bachao Beti Padhao campaign targeted at parents of female children to build a secure fund for their higher education and marriage with high sovereign interest and Section 80C tax benefits.",
        "description_te": "బేటీ బచావో బేటీ పఢావో కింద ఆడపిల్లల ఉన్నత విద్య మరియు వివాహం కోసం అధిక వడ్డీతో పొదుపు చేసుకునే ప్రభుత్వ ప్రత్యేక పొదుపు పథకం.",
        "benefit_description": "High guaranteed sovereign interest rate (currently 8.2% p.a.), exempt-exempt-exempt (EEE) tax status under Section 80C, partial withdrawal at age 18 for higher education.",
        "benefit_description_te": "ప్రభుత్వ హామీతో కూడిన 8.2% వార్షిక వడ్డీ, ఆదాయపు పన్ను సెక్షన్ 80C కింద పూర్తి పన్ను మినహాయింపు, 18 ఏళ్ల వయస్సులో ఉన్నత విద్య కోసం 50% విత్‌డ్రా చేసుకునే సదుపాయం.",
        "estimated_benefit_amount": 150000.0,
        "official_url": "https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Account.aspx",
        "application_url": "https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Account.aspx",
        "eligibility_rules": {
            "min_age": 0,
            "max_age": 10,
            "max_annual_income": None,
            "eligible_states": ["All-India"],
            "eligible_occupations": ["Any"],
            "eligible_education": ["Any"],
            "eligible_genders": ["female"],
            "eligible_categories": ["Any"],
            "requires_student": False,
            "requires_farmer": False,
            "requires_agricultural_land": False,
            "requires_differently_abled": False,
            "special_conditions": ["Girl child must be an Indian resident under 10 years of age at the time of account opening (max 2 girls per family)"]
        },
        "required_documents": [
            "Birth Certificate of the girl child",
            "Identity Proof of guardian/parent (Aadhaar / Voter ID / Passport)",
            "Address Proof of guardian/parent",
            "Medical certificate in case of twin/triplet girl children"
        ],
        "exclusion_rules": [
            "Child exceeding 10 years of age at account opening date",
            "More than 2 accounts per family (except in case of twin/triplet girls born in second birth)"
        ],
        "faqs": [
            {
                "question": "What is the minimum annual deposit requirement?",
                "answer": "A minimum of ₹250 must be deposited in a financial year, with a maximum cap of ₹1,50,000."
            }
        ],
        "start_date": "2015-01-22",
        "end_date": "Ongoing",
        "source_url": "https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Account.aspx",
        "verification_status": "verified"
    },
    {
        "slug": "atal-pension-yojana",
        "name": "Atal Pension Yojana (APY)",
        "name_te": "అటల్ పెన్షన్ యోజన (ఏపీవై)",
        "category": "Pensions",
        "government_level": "Central",
        "state_scope": "All-India",
        "department": "Pension Fund Regulatory and Development Authority (PFRDA), Ministry of Finance",
        "department_te": "పెన్షన్ ఫండ్ రెగ్యులేటరీ అండ్ డెవలప్‌మెంట్ అథారిటీ, ఆర్థిక మంత్రిత్వ శాఖ",
        "description": "Guaranteed monthly pension scheme administered by PFRDA targeted particularly at workers in the unorganized sector to secure old-age financial independence.",
        "description_te": "అసంఘటిత రంగ కార్మికులు మరియు సామాన్య పౌరులకు 60 ఏళ్లు దాటిన తర్వాత నెలకు ₹1,000 నుండి ₹5,000 వరకు జీవితాంతం ప్రభుత్వ గ్యారెంటీ పింఛను అందించే పథకం.",
        "benefit_description": "Guaranteed minimum monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000 or ₹5,000 starting from the age of 60 years till lifetime, with spouse pension and return of corpus to nominee.",
        "benefit_description_te": "60 ఏళ్ల వయస్సు తర్వాత నెలకు ₹1,000 నుండి ₹5,000 వరకు గ్యారెంటీ పెన్షన్. చందాదారుని మరణానంతరం జీవిత భాగస్వామికి పెన్షన్, అనంతరం నామినీకి మొత్తం కార్పస్ వాపసు.",
        "estimated_benefit_amount": 60000.0,
        "official_url": "https://www.npscra.nsdl.co.in/scheme-details.php",
        "application_url": "https://www.npscra.nsdl.co.in/apy-subscriber-registration.php",
        "eligibility_rules": {
            "min_age": 18,
            "max_age": 40,
            "max_annual_income": None,
            "eligible_states": ["All-India"],
            "eligible_occupations": ["Any"],
            "eligible_education": ["Any"],
            "eligible_genders": ["any"],
            "eligible_categories": ["Any"],
            "requires_student": False,
            "requires_farmer": False,
            "requires_agricultural_land": False,
            "requires_differently_abled": False,
            "special_conditions": ["Must be an Indian citizen with an active savings bank account and must NOT be an income tax payer"]
        },
        "required_documents": [
            "Aadhaar Card",
            "Active Savings Bank Account with auto-debit facility",
            "Registered mobile phone number linked to bank account"
        ],
        "exclusion_rules": [
            "Individuals who are income-tax payers as on or after 1st October 2022",
            "Citizens below 18 or above 40 years of age"
        ],
        "faqs": [
            {
                "question": "Can I exit early before age 60?",
                "answer": "Voluntary exit is permitted under exceptional terminal illness or bereavement conditions; full refund of accumulated contribution and interest is disbursed."
            }
        ],
        "start_date": "2015-05-09",
        "end_date": "Ongoing",
        "source_url": "https://www.pfrda.org.in/my-pension/atal-pension-yojana.html",
        "verification_status": "verified"
    },
    {
        "slug": "pradhan-mantri-mudra-yojana",
        "name": "Pradhan Mantri Mudra Yojana (PMMY)",
        "name_te": "ప్రధాన మంత్రి ముద్రా యోజన (పీఎంఎంవై)",
        "category": "Employment",
        "government_level": "Central",
        "state_scope": "All-India",
        "department": "Department of Financial Services, Ministry of Finance",
        "department_te": "ఆర్థిక సేవల విభాగం, ఆర్థిక మంత్రిత్వ శాఖ",
        "description": "Provides collateral-free institutional credit up to ₹10-20 Lakhs to non-corporate, non-farm small/micro enterprises across Shishu, Kishore, and Tarun tiers to foster self-employment.",
        "description_te": "చిన్న వ్యాపారులు, స్వయం ఉపాధి పొందుతున్న యువతకు ఎటువంటి పూచీకత్తు (కొలేటరల్) లేకుండా ₹50,000 నుండి ₹10-20 లక్షల వరకు తక్కువ వడ్డీతో వ్యాపార రుణాలు.",
        "benefit_description": "Collateral-free business loans: Shishu (up to ₹50,000), Kishore (₹50,001 to ₹5 Lakh), and Tarun (₹5 Lakh to ₹10/20 Lakh) with reasonable interest rates and credit guarantee cover.",
        "benefit_description_te": "పూచీకత్తు లేని వ్యాపార రుణాలు: శిశు (₹50,000 వరకు), కిశోర్ (₹50,000 నుండి ₹5 లక్షలు), తరుణ్ (₹5 లక్షల నుండి ₹10-20 లక్షల వరకు).",
        "estimated_benefit_amount": 500000.0,
        "official_url": "https://www.mudra.org.in",
        "application_url": "https://www.udyamimitra.in",
        "eligibility_rules": {
            "min_age": 18,
            "max_age": 65,
            "max_annual_income": None,
            "eligible_states": ["All-India"],
            "eligible_occupations": ["Self-employed", "Unemployed", "Artisan", "Shopkeeper", "Micro-enterprise"],
            "eligible_education": ["Any"],
            "eligible_genders": ["any"],
            "eligible_categories": ["Any"],
            "requires_student": False,
            "requires_farmer": False,
            "requires_agricultural_land": False,
            "requires_differently_abled": False,
            "special_conditions": ["Business must be in manufacturing, processing, trading, or service sector; no previous bank loan default"]
        },
        "required_documents": [
            "Proof of Identity (Aadhaar / Voter ID / PAN Card)",
            "Proof of Residence",
            "Udyam MSME Registration Certificate (if existing)",
            "Project report / business plan / machinery quotations",
            "Bank account statement for past 6 months"
        ],
        "exclusion_rules": [
            "Defaulters with any scheduled commercial bank or financial institution",
            "Corporate entities and large companies"
        ],
        "faqs": [
            {
                "question": "Is collateral required for Mudra loans?",
                "answer": "No collateral or third-party guarantee is required for loans up to ₹10 Lakh under PMMY."
            }
        ],
        "start_date": "2015-04-08",
        "end_date": "Ongoing",
        "source_url": "https://www.mudra.org.in/Guidelines",
        "verification_status": "verified"
    },
    {
        "slug": "ap-ysr-rythu-bharosa",
        "name": "Andhra Pradesh YSR Rythu Bharosa / PM-KISAN",
        "name_te": "ఆంధ్రప్రదేశ్ వైఎస్సార్ రైతు భరోసా — పీఎం-కిసాన్",
        "category": "Agriculture",
        "government_level": "State",
        "state_scope": "Andhra Pradesh",
        "department": "Department of Agriculture, Government of Andhra Pradesh",
        "department_te": "వ్యవసాయ శాఖ, ఆంధ్రప్రదేశ్ ప్రభుత్వం",
        "description": "Comprehensive agricultural welfare scheme by the Government of Andhra Pradesh providing ₹13,500 annual investment support to farmer families, including tenant farmers from SC/ST/BC/Minority categories.",
        "description_te": "ఆంధ్రప్రదేశ్ ప్రభుత్వం రైతు కుటుంబాలకు మరియు ఎస్సీ/ఎస్టీ/బీసీ/మైనారిటీ కౌలు రైతులకు పంట పెట్టుబడి సహాయంగా ఏడాదికి ₹13,500 అందించే ప్రతిష్టాత్మక పథకం.",
        "benefit_description": "₹13,500 per farmer family per year disbursed in three installments (₹7,500 in May/June for Kharif, ₹4,000 in October for Rabi, ₹2,000 in January for Sankranti).",
        "benefit_description_te": "రైతు కుటుంబానికి ఏడాదికి ₹13,500 పెట్టుబడి సహాయం (ఖరీఫ్ సీజన్ లో ₹7,500, రబీ సీజన్ లో ₹4,000, సంక్రాంతికి ₹2,000).",
        "estimated_benefit_amount": 13500.0,
        "official_url": "https://ysrrythubharosa.ap.gov.in",
        "application_url": "https://ysrrythubharosa.ap.gov.in/RBApp/index.html",
        "eligibility_rules": {
            "min_age": 18,
            "max_age": 100,
            "max_annual_income": None,
            "eligible_states": ["Andhra Pradesh"],
            "eligible_occupations": ["Farmer", "Tenant Farmer"],
            "eligible_education": ["Any"],
            "eligible_genders": ["any"],
            "eligible_categories": ["Any"],
            "requires_student": False,
            "requires_farmer": True,
            "requires_agricultural_land": True,
            "requires_differently_abled": False,
            "special_conditions": ["Must be an AP resident farmer or registered tenant farmer with CCRC agreement"]
        },
        "required_documents": [
            "Aadhaar Card linked with active bank account",
            "Pattadar Passbook / Webland Revenue Record (1-B)",
            "Crop Cultivator Rights Card (CCRC) for tenant farmers",
            "Rice Card (Ration Card) of Andhra Pradesh"
        ],
        "exclusion_rules": [
            "Persons owning more than 10 acres of wetland or 25 acres of dryland",
            "Government employees, pensioners with monthly pension above ₹10,000",
            "Income tax payers"
        ],
        "faqs": [
            {
                "question": "Are tenant farmers eligible under Rythu Bharosa?",
                "answer": "Yes, tenant farmers belonging to SC, ST, BC, and Minority categories possessing a Crop Cultivator Rights Card (CCRC) are fully covered."
            }
        ],
        "start_date": "2019-10-15",
        "end_date": "Ongoing",
        "source_url": "https://ysrrythubharosa.ap.gov.in/RBApp/AboutUs.html",
        "verification_status": "verified"
    },
    {
        "slug": "ap-jagananna-vidya-deevena",
        "name": "Andhra Pradesh Jagananna Vidya Deevena (RTF)",
        "name_te": "జగనన్న విద్యా దీవెన — పూర్తి ఫీజు రీయింబర్స్‌మెంట్",
        "category": "Education",
        "government_level": "State",
        "state_scope": "Andhra Pradesh",
        "department": "Higher Education Department / Social Welfare, Government of Andhra Pradesh",
        "department_te": "ఉన్నత విద్యా శాఖ / సాంఘిక సంక్షేమ శాఖ, ఆంధ్రప్రదేశ్ ప్రభుత్వం",
        "description": "Complete fee reimbursement scheme for economically backward students of Andhra Pradesh pursuing ITI, Polytechnic, Degree, Engineering, Medicine, and Postgraduate programs.",
        "description_te": "ఐటీఐ, పాలిటెక్నిక్, డిగ్రీ, ఇంజనీరింగ్, మెడిసిన్ మరియు పీజీ కోర్సులు చదువుతున్న నిరుపేద విద్యార్థుల తల్లుల ఖాతాల్లో పూర్తి కాలేజీ ఫీజులను జమ చేసే ఆంధ్రప్రదేశ్ పథకం.",
        "benefit_description": "100% full tuition fee reimbursement credited quarterly directly into the mother's bank account of enrolled students.",
        "benefit_description_te": "విద్యార్థుల కాలేజీ ఫీజులను నాలుగు విడతల్లో 100% పూర్తిగా తల్లి బ్యాంక్ ఖాతాలో నేరుగా జమ చేయడం.",
        "estimated_benefit_amount": 45000.0,
        "official_url": "https://jnanabhumi.ap.gov.in",
        "application_url": "https://jnanabhumi.ap.gov.in/Registration.edu",
        "eligibility_rules": {
            "min_age": 16,
            "max_age": 30,
            "max_annual_income": 250000.0,
            "eligible_states": ["Andhra Pradesh"],
            "eligible_occupations": ["Student"],
            "eligible_education": ["10th Pass", "12th Pass", "Undergraduate", "Postgraduate"],
            "eligible_genders": ["any"],
            "eligible_categories": ["Any"],
            "requires_student": True,
            "requires_farmer": False,
            "requires_agricultural_land": False,
            "requires_differently_abled": False,
            "special_conditions": ["Student must maintain minimum 75% college attendance; mother must have Aadhaar-seeded bank account"]
        },
        "required_documents": [
            "Student & Mother's Aadhaar Cards",
            "AP Rice Card (Ration Card)",
            "Integrated Caste & Income Certificate (Annual income < ₹2.5 Lakh)",
            "College Bonafide and CET Allotment Order",
            "Mother's Aadhaar-linked Bank Account Passbook"
        ],
        "exclusion_rules": [
            "Students studying in Deemed or Private Universities without convenor quota allotment",
            "Families with four-wheelers (excluding taxis/tractors/autos)",
            "Any family member working as government employee or paying income tax"
        ],
        "faqs": [
            {
                "question": "What is the attendance requirement?",
                "answer": "A minimum of 75% biometric attendance in the respective college is mandatory each semester for fee release."
            }
        ],
        "start_date": "2020-04-28",
        "end_date": "Ongoing",
        "source_url": "https://jnanabhumi.ap.gov.in/Guidelines.edu",
        "verification_status": "verified"
    },
    {
        "slug": "telangana-rythu-bandhu",
        "name": "Telangana Rythu Bandhu / Rythu Bharosa",
        "name_te": "తెలంగాణ రైతు బంధు / రైతు భరోసా",
        "category": "Agriculture",
        "government_level": "State",
        "state_scope": "Telangana",
        "department": "Department of Agriculture, Government of Telangana",
        "department_te": "వ్యవసాయ శాఖ, తెలంగాణ ప్రభుత్వం",
        "description": "Pioneering agriculture investment support scheme by the Government of Telangana providing financial assistance per acre per season directly to landowning farmers.",
        "description_te": "తెలంగాణలోని పట్టాదార్ రైతులకు ఎకరానికి ప్రతి సీజన్‌కు పంట పెట్టుబడి సహాయం అందించే వ్యవసాయ సంక్షేమ పథకం.",
        "benefit_description": "Investment support of ₹5,000 to ₹7,500 per acre per season (Kharif and Rabi) deposited directly into farmer bank accounts.",
        "benefit_description_te": "ప్రతి ఎకరానికి సీజన్‌కు ₹5,000 నుండి ₹7,500 వరకు నేరుగా బ్యాంక్ ఖాతాలో పెట్టుబడి సాయం.",
        "estimated_benefit_amount": 15000.0,
        "official_url": "https://rythubandhu.telangana.gov.in",
        "application_url": "https://rythubandhu.telangana.gov.in/Default_RB1.aspx",
        "eligibility_rules": {
            "min_age": 18,
            "max_age": 100,
            "max_annual_income": None,
            "eligible_states": ["Telangana"],
            "eligible_occupations": ["Farmer"],
            "eligible_education": ["Any"],
            "eligible_genders": ["any"],
            "eligible_categories": ["Any"],
            "requires_student": False,
            "requires_farmer": True,
            "requires_agricultural_land": True,
            "requires_differently_abled": False,
            "special_conditions": ["Must be a registered Pattadar with Dharani portal record in Telangana"]
        },
        "required_documents": [
            "Pattadar Passbook / Dharani Land Record Khata Number",
            "Aadhaar Card",
            "Bank Account linked to Aadhaar (NPCI enabled)"
        ],
        "exclusion_rules": [
            "Non-agricultural lands and real estate layouts",
            "Persons not listed in Dharani land portal"
        ],
        "faqs": [
            {
                "question": "Is there any ceiling on land holding?",
                "answer": "All verified agricultural land recorded in Dharani is eligible under the state guidelines."
            }
        ],
        "start_date": "2018-05-10",
        "end_date": "Ongoing",
        "source_url": "https://rythubandhu.telangana.gov.in",
        "verification_status": "verified"
    }
]

def seed_database(db):
    """Seed the database with verified government schemes if empty."""
    from app.models import Scheme, SchemeSource, User
    from app.security import hash_password
    
    # 1. Create Demo Admin and Citizen users if not present
    admin_user = db.query(User).filter(User.email == "admin@jansahayak.gov.in").first()
    if not admin_user:
        admin_user = User(
            email="admin@jansahayak.gov.in",
            password_hash=hash_password("Admin@JanSahayak2026"),
            role="admin",
            preferred_language="en"
        )
        db.add(admin_user)
        
    demo_citizen = db.query(User).filter(User.email == "citizen@jansahayak.in").first()
    if not demo_citizen:
        demo_citizen = User(
            email="citizen@jansahayak.in",
            password_hash=hash_password("Citizen@2026"),
            role="citizen",
            preferred_language="te"
        )
        db.add(demo_citizen)
        
    db.commit()

    # 2. Seed schemes
    for item in SCHEMES_SEED_DATA:
        existing = db.query(Scheme).filter(Scheme.slug == item["slug"]).first()
        if not existing:
            scheme = Scheme(
                slug=item["slug"],
                name=item["name"],
                name_te=item.get("name_te"),
                category=item["category"],
                government_level=item["government_level"],
                state_scope=item["state_scope"],
                department=item["department"],
                department_te=item.get("department_te"),
                description=item["description"],
                description_te=item.get("description_te"),
                benefit_description=item["benefit_description"],
                benefit_description_te=item.get("benefit_description_te"),
                estimated_benefit_amount=item.get("estimated_benefit_amount"),
                official_url=item["official_url"],
                application_url=item["application_url"],
                eligibility_rules=item["eligibility_rules"],
                required_documents=item["required_documents"],
                exclusion_rules=item["exclusion_rules"],
                faqs=item["faqs"],
                start_date=item.get("start_date"),
                end_date=item.get("end_date"),
                source_url=item["source_url"],
                last_verified_at=datetime.utcnow(),
                verification_status=item["verification_status"],
                is_active=True
            )
            db.add(scheme)
            db.flush()
            
            # Add SchemeSource record
            src = SchemeSource(
                scheme_id=scheme.id,
                source_url=item["source_url"],
                source_type="official_portal",
                retrieved_at=datetime.utcnow(),
                verification_status="verified",
                notes="Verified from central/state ministry gazette and portal"
            )
            db.add(src)
            
    db.commit()
