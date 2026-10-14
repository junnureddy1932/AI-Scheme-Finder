from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import SavedScheme, Scheme, User
from app.schemas import SavedSchemeCreate, SavedSchemeResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/saved-schemes", tags=["Saved Schemes"])

@router.get("", response_model=List[SavedSchemeResponse])
def get_saved_schemes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve bookmarked schemes for the current user."""
    return db.query(SavedScheme).filter(SavedScheme.user_id == current_user.id).order_by(SavedScheme.saved_at.desc()).all()


@router.post("", response_model=SavedSchemeResponse, status_code=status.HTTP_201_CREATED)
def save_scheme(
    item: SavedSchemeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Bookmark a verified government scheme."""
    scheme = db.query(Scheme).filter(Scheme.id == item.scheme_id, Scheme.is_active == True).first()
    if not scheme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")
        
    existing = db.query(SavedScheme).filter(
        SavedScheme.user_id == current_user.id,
        SavedScheme.scheme_id == item.scheme_id
    ).first()
    
    if existing:
        return existing
        
    saved = SavedScheme(user_id=current_user.id, scheme_id=item.scheme_id)
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return saved


@router.delete("/{scheme_id}", status_code=status.HTTP_200_OK)
def remove_saved_scheme(
    scheme_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a scheme from bookmarked list."""
    saved = db.query(SavedScheme).filter(
        SavedScheme.user_id == current_user.id,
        SavedScheme.scheme_id == scheme_id
    ).first()
    if not saved:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme was not in saved list")
        
    db.delete(saved)
    db.commit()
    return {"message": "Scheme removed from saved list"}
