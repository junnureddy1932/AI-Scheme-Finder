from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database import get_db
from app.models import User, UserProfile
from app.schemas import UserRegister, UserLogin, UserResponse, Token
from app.security import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    """Register a new citizen account."""
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )
    
    new_user = User(
        email=user_in.email.lower(),
        password_hash=hash_password(user_in.password),
        role="citizen",
        preferred_language=user_in.preferred_language or "en",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token({"sub": str(new_user.id), "email": new_user.email, "role": new_user.role})
    
    user_res = UserResponse(
        id=new_user.id,
        email=new_user.email,
        role=new_user.role,
        preferred_language=new_user.preferred_language,
        created_at=new_user.created_at,
        has_profile=False
    )
    return Token(access_token=token, token_type="bearer", user=user_res)


@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user with email and password."""
    user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    has_profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first() is not None
    
    user_res = UserResponse(
        id=user.id,
        email=user.email,
        role=user.role,
        preferred_language=user.preferred_language,
        created_at=user.created_at,
        has_profile=has_profile
    )
    return Token(access_token=token, token_type="bearer", user=user_res)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieve currently authenticated user profile."""
    has_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first() is not None
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        role=current_user.role,
        preferred_language=current_user.preferred_language,
        created_at=current_user.created_at,
        has_profile=has_profile
    )
