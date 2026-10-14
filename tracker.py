from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import ApplicationTracker, Scheme, User
from app.schemas import TrackerCreate, TrackerUpdate, TrackerResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/tracker", tags=["Application Tracker"])

VALID_STATUSES = [
    "INTERESTED",
    "CHECKING_ELIGIBILITY",
    "DOCUMENTS_PREPARED",
    "READY_TO_APPLY",
    "APPLIED",
    "APPROVED",
    "REJECTED",
    "NEEDS_FOLLOW_UP"
]

@router.get("", response_model=List[TrackerResponse])
def get_tracker_items(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all tracked scheme application records for current user."""
    return db.query(ApplicationTracker).filter(
        ApplicationTracker.user_id == current_user.id
    ).order_by(ApplicationTracker.updated_at.desc()).all()


@router.post("", response_model=TrackerResponse, status_code=status.HTTP_201_CREATED)
def create_tracker_item(
    item_in: TrackerCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a scheme to the citizen application tracking workflow."""
    scheme = db.query(Scheme).filter(Scheme.id == item_in.scheme_id, Scheme.is_active == True).first()
    if not scheme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")
        
    status_val = item_in.status.upper()
    if status_val not in VALID_STATUSES:
        status_val = "INTERESTED"
        
    existing = db.query(ApplicationTracker).filter(
        ApplicationTracker.user_id == current_user.id,
        ApplicationTracker.scheme_id == item_in.scheme_id
    ).first()
    
    if existing:
        existing.status = status_val
        if item_in.notes is not None:
            existing.notes = item_in.notes
        if item_in.target_deadline is not None:
            existing.target_deadline = item_in.target_deadline
        existing.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing
        
    tracker = ApplicationTracker(
        user_id=current_user.id,
        scheme_id=item_in.scheme_id,
        status=status_val,
        notes=item_in.notes,
        target_deadline=item_in.target_deadline,
        updated_at=datetime.utcnow()
    )
    db.add(tracker)
    db.commit()
    db.refresh(tracker)
    return tracker


@router.patch("/{tracker_id}", response_model=TrackerResponse)
def update_tracker_item(
    tracker_id: int,
    item_in: TrackerUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user progress status, deadline, or private notes for an application."""
    tracker = db.query(ApplicationTracker).filter(
        ApplicationTracker.id == tracker_id,
        ApplicationTracker.user_id == current_user.id
    ).first()
    if not tracker:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tracker item not found")
        
    if item_in.status is not None:
        status_val = item_in.status.upper()
        if status_val in VALID_STATUSES:
            tracker.status = status_val
            
    if item_in.notes is not None:
        tracker.notes = item_in.notes
        
    if item_in.target_deadline is not None:
        tracker.target_deadline = item_in.target_deadline
        
    tracker.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(tracker)
    return tracker


@router.delete("/{tracker_id}", status_code=status.HTTP_200_OK)
def delete_tracker_item(
    tracker_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove an item from tracking progress."""
    tracker = db.query(ApplicationTracker).filter(
        ApplicationTracker.id == tracker_id,
        ApplicationTracker.user_id == current_user.id
    ).first()
    if not tracker:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tracker item not found")
        
    db.delete(tracker)
    db.commit()
    return {"message": "Application removed from tracker"}
