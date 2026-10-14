from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, Float, Text, JSON, DateTime, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="citizen", nullable=False)  # "citizen" | "admin"
    preferred_language = Column(String(10), default="en", nullable=False)  # "en" | "te"
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    saved_schemes = relationship("SavedScheme", back_populates="user", cascade="all, delete-orphan")
    trackers = relationship("ApplicationTracker", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Demographics
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)  # "male" | "female" | "transgender" | "prefer_not_to_say"
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    
    # Socio-economic & employment
    occupation = Column(String(100), nullable=True)  # e.g., "Farmer", "Student", "Unemployed", "Self-employed", "Private Sector"
    education_level = Column(String(100), nullable=True)  # "Below 10th", "10th Pass", "12th Pass", "Undergraduate", "Postgraduate", "Vocational"
    income_range = Column(String(100), nullable=True)  # "Below 1 Lakh", "1-2.5 Lakh", "2.5-5 Lakh", "5-8 Lakh", "Above 8 Lakh"
    annual_income = Column(Float, nullable=True)
    
    # Optional sensitive attributes (collected with explicit consent)
    social_category = Column(String(50), nullable=True)  # "General", "OBC", "SC", "ST", "EWS"
    is_student = Column(Boolean, default=False, nullable=True)
    is_farmer = Column(Boolean, default=False, nullable=True)
    is_differently_abled = Column(Boolean, default=False, nullable=True)
    has_agricultural_land = Column(Boolean, default=False, nullable=True)
    family_size = Column(Integer, nullable=True)
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="profile")


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    name = Column(String(255), index=True, nullable=False)
    name_te = Column(String(255), nullable=True)
    category = Column(String(100), index=True, nullable=False)  # Scholarships, Agriculture, Healthcare, Housing, etc.
    government_level = Column(String(50), default="Central", nullable=False)  # Central | State
    state_scope = Column(String(100), default="All-India", index=True, nullable=False)
    department = Column(String(255), nullable=False)
    department_te = Column(String(255), nullable=True)
    
    description = Column(Text, nullable=False)
    description_te = Column(Text, nullable=True)
    benefit_description = Column(Text, nullable=False)
    benefit_description_te = Column(Text, nullable=True)
    estimated_benefit_amount = Column(Float, nullable=True)
    
    official_url = Column(String(500), nullable=False)
    application_url = Column(String(500), nullable=False)
    
    # Rules & content stored as structured JSON
    eligibility_rules = Column(JSON, default=dict, nullable=False)
    required_documents = Column(JSON, default=list, nullable=False)
    exclusion_rules = Column(JSON, default=list, nullable=False)
    faqs = Column(JSON, default=list, nullable=False)
    
    start_date = Column(String(50), nullable=True)
    end_date = Column(String(50), nullable=True)
    source_url = Column(String(500), nullable=False)
    last_verified_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    verification_status = Column(String(50), default="verified", nullable=False)  # verified | unverified | draft
    is_active = Column(Boolean, default=True, nullable=False)

    sources = relationship("SchemeSource", back_populates="scheme", cascade="all, delete-orphan")
    saved_by = relationship("SavedScheme", back_populates="scheme", cascade="all, delete-orphan")
    trackers = relationship("ApplicationTracker", back_populates="scheme", cascade="all, delete-orphan")


class SavedScheme(Base):
    __tablename__ = "saved_schemes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    saved_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "scheme_id", name="uq_user_scheme_saved"),
    )

    user = relationship("User", back_populates="saved_schemes")
    scheme = relationship("Scheme", back_populates="saved_by")


class ApplicationTracker(Base):
    __tablename__ = "application_trackers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    
    # Status progression
    # INTERESTED | CHECKING_ELIGIBILITY | DOCUMENTS_PREPARED | READY_TO_APPLY | APPLIED | APPROVED | REJECTED | NEEDS_FOLLOW_UP
    status = Column(String(50), default="INTERESTED", nullable=False)
    notes = Column(Text, nullable=True)
    target_deadline = Column(String(100), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "scheme_id", name="uq_user_scheme_tracker"),
    )

    user = relationship("User", back_populates="trackers")
    scheme = relationship("Scheme", back_populates="trackers")


class SchemeSource(Base):
    __tablename__ = "scheme_sources"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    source_url = Column(String(500), nullable=False)
    source_type = Column(String(100), default="official_portal", nullable=False)
    retrieved_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    verification_status = Column(String(50), default="verified", nullable=False)
    notes = Column(Text, nullable=True)

    scheme = relationship("Scheme", back_populates="sources")
