from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime

# --- Auth & User ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    preferred_language: Optional[str] = "en"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    preferred_language: str
    created_at: datetime
    has_profile: bool = False

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- User Profile ---
class UserProfileBase(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    occupation: Optional[str] = None
    education_level: Optional[str] = None
    income_range: Optional[str] = None
    annual_income: Optional[float] = None
    social_category: Optional[str] = None
    is_student: Optional[bool] = False
    is_farmer: Optional[bool] = False
    is_differently_abled: Optional[bool] = False
    has_agricultural_land: Optional[bool] = False
    family_size: Optional[int] = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileUpdate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: int
    user_id: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Scheme ---
class SchemeBase(BaseModel):
    slug: str
    name: str
    name_te: Optional[str] = None
    category: str
    government_level: str = "Central"
    state_scope: str = "All-India"
    department: str
    department_te: Optional[str] = None
    description: str
    description_te: Optional[str] = None
    benefit_description: str
    benefit_description_te: Optional[str] = None
    estimated_benefit_amount: Optional[float] = None
    official_url: str
    application_url: str
    eligibility_rules: Dict[str, Any] = {}
    required_documents: List[str] = []
    exclusion_rules: List[str] = []
    faqs: List[Dict[str, str]] = []
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    source_url: str
    verification_status: str = "verified"
    is_active: bool = True

class SchemeCreate(SchemeBase):
    pass

class SchemeResponse(SchemeBase):
    id: int
    last_verified_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Eligibility Matching ---
class SchemeMatchResult(BaseModel):
    scheme: SchemeResponse
    eligibility_status: str  # Likely eligible | Possibly eligible | Not eligible | Insufficient information
    relevance_score: float   # 0 to 100 internal score
    matched_criteria: List[str] = []
    failed_criteria: List[str] = []
    missing_fields: List[str] = []
    summary_explanation: str
    official_application_url: str
    verification_date: str


# --- Saved Schemes ---
class SavedSchemeCreate(BaseModel):
    scheme_id: int

class SavedSchemeResponse(BaseModel):
    id: int
    user_id: int
    scheme_id: int
    saved_at: datetime
    scheme: SchemeResponse

    model_config = ConfigDict(from_attributes=True)


# --- Application Tracker ---
class TrackerCreate(BaseModel):
    scheme_id: int
    status: str = "INTERESTED"
    notes: Optional[str] = None
    target_deadline: Optional[str] = None

class TrackerUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    target_deadline: Optional[str] = None

class TrackerResponse(BaseModel):
    id: int
    user_id: int
    scheme_id: int
    status: str
    notes: Optional[str] = None
    target_deadline: Optional[str] = None
    updated_at: datetime
    scheme: SchemeResponse

    model_config = ConfigDict(from_attributes=True)


# --- AI Conversational Assistant ---
class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []
    user_language: Optional[str] = "en"

class ChatResponse(BaseModel):
    answer: str
    cited_schemes: List[SchemeResponse] = []
    follow_up_suggestions: List[str] = []
    disclaimer: str = (
        "Disclaimer: JanSahayak AI provides preliminary scheme guidance based on official portal "
        "guidelines. Final eligibility and benefit allocation are determined exclusively by the respective "
        "government departments upon verified application."
    )
