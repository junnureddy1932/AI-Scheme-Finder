from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserProfile
from app.schemas import UserProfileUpdate, UserProfileResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/profile", tags=["User Profile"])

@router.get("", response_model=UserProfileResponse)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve the profile for the authenticated citizen."""
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile has not been set up yet. Please complete onboarding."
        )
    return profile

@router.put("", response_model=UserProfileResponse)
def upsert_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update user profile with voluntary socio-economic information."""
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    data_dict = profile_data.dict(exclude_unset=True)
    
    if not profile:
        profile = UserProfile(user_id=current_user.id, **data_dict)
        db.add(profile)
    else:
        for key, val in data_dict.items():
            setattr(profile, key, val)
            
    db.commit()
    db.refresh(profile)
    return profile

@router.delete("", status_code=status.HTTP_200_OK)
def delete_account_and_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Privacy compliant data purging:
    Permanently deletes user account, profile, saved schemes, and tracker data.
    """
    db.delete(current_user)
    db.commit()
    return {"message": "User account and all associated profile data have been permanently purged."}
