import pytest
from fastapi.testclient import TestClient
import os
import sys

# Ensure backend root is in Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Set testing environment database
os.environ["DATABASE_URL"] = "sqlite:///./test_jansahayak.db"

from app.main import app
from app.database import Base, engine, SessionLocal
from app.seed_data import seed_database
from app.models import Scheme, UserProfile
from app.services.eligibility_engine import evaluate_scheme_eligibility

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_jansahayak.db"):
        try:
            os.remove("./test_jansahayak.db")
        except Exception:
            pass

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_user_registration_and_login():
    # Register new citizen
    reg_res = client.post("/api/auth/register", json={
        "email": "test_citizen@example.com",
        "password": "Password123!",
        "preferred_language": "en"
    })
    assert reg_res.status_code == 201
    token_data = reg_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # Test me endpoint
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "test_citizen@example.com"

    # Test Login
    login_res = client.post("/api/auth/login", json={
        "email": "test_citizen@example.com",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

def test_scheme_listing_and_filtering():
    res = client.get("/api/schemes")
    assert res.status_code == 200
    schemes = res.json()
    assert len(schemes) >= 5

    # Filter by category
    agri_res = client.get("/api/schemes?category=Agriculture")
    assert agri_res.status_code == 200
    for s in agri_res.json():
        assert s["category"] == "Agriculture"

    # Filter by state
    ap_res = client.get("/api/schemes?state=Andhra%20Pradesh")
    assert ap_res.status_code == 200
    ap_schemes = ap_res.json()
    assert any("Andhra Pradesh" in s["name"] or s["state_scope"] == "Andhra Pradesh" for s in ap_schemes)

def test_eligibility_engine_profiles():
    db = SessionLocal()
    pm_kisan = db.query(Scheme).filter(Scheme.slug == "pm-kisan-samman-nidhi").first()
    scholarship = db.query(Scheme).filter(Scheme.slug == "post-matric-scholarship-sc-st-obc").first()
    vidya_deevena = db.query(Scheme).filter(Scheme.slug == "ap-jagananna-vidya-deevena").first()
    assert pm_kisan is not None
    assert scholarship is not None

    # Profile 1: Small Farmer with Land
    farmer_profile = UserProfile(
        age=38,
        state="Andhra Pradesh",
        occupation="Farmer",
        is_farmer=True,
        has_agricultural_land=True,
        annual_income=120000.0
    )
    farmer_eval = evaluate_scheme_eligibility(pm_kisan, farmer_profile)
    assert farmer_eval["eligibility_status"] in ["Likely eligible", "Possibly eligible"]
    assert farmer_eval["relevance_score"] > 70

    # Profile 2: College Student from Andhra Pradesh
    student_profile = UserProfile(
        age=20,
        state="Andhra Pradesh",
        occupation="Student",
        education_level="Undergraduate",
        is_student=True,
        social_category="OBC",
        annual_income=150000.0
    )
    student_scholarship_eval = evaluate_scheme_eligibility(scholarship, student_profile)
    assert student_scholarship_eval["eligibility_status"] in ["Likely eligible", "Possibly eligible"]

    # Student evaluating Vidya Deevena (AP State scheme)
    vidya_eval = evaluate_scheme_eligibility(vidya_deevena, student_profile)
    assert vidya_eval["eligibility_status"] in ["Likely eligible", "Possibly eligible"]

    # Boundary test: High income violation
    rich_student = UserProfile(
        age=20,
        state="Andhra Pradesh",
        occupation="Student",
        education_level="Undergraduate",
        is_student=True,
        social_category="OBC",
        annual_income=600000.0  # Exceeds 2.5 Lakh limit
    )
    rich_eval = evaluate_scheme_eligibility(scholarship, rich_student)
    assert rich_eval["eligibility_status"] == "Not eligible"
    assert any("exceeds" in f.lower() for f in rich_eval["failed_criteria"])

    # Boundary test: Age violation
    elderly_student = UserProfile(
        age=65,  # Exceeds 35 years
        state="Andhra Pradesh",
        occupation="Student",
        is_student=True,
        social_category="OBC",
        annual_income=100000.0
    )
    elderly_eval = evaluate_scheme_eligibility(scholarship, elderly_student)
    assert elderly_eval["eligibility_status"] == "Not eligible"

    # Missing info test: Blank profile
    blank_profile = UserProfile()
    blank_eval = evaluate_scheme_eligibility(scholarship, blank_profile)
    assert blank_eval["eligibility_status"] in ["Insufficient information", "Possibly eligible"]
    assert len(blank_eval["missing_fields"]) > 0

    db.close()

def test_ai_assistant_chat_endpoint():
    res = client.post("/api/assistant/chat", json={
        "message": "What documents are required for PM-KISAN?",
        "user_language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert len(data["cited_schemes"]) > 0
    assert any("pm-kisan" in s["slug"].lower() for s in data["cited_schemes"])
    assert "disclaimer" in data
