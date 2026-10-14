from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import Scheme, SchemeSource, User
from app.schemas import SchemeCreate, SchemeResponse
from app.dependencies import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

@router.get("/schemes", response_model=List[SchemeResponse])
def admin_list_schemes(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin endpoint: List all schemes including drafts and unverified records."""
    return db.query(Scheme).order_by(Scheme.id.desc()).all()


@router.post("/schemes", response_model=SchemeResponse, status_code=status.HTTP_201_CREATED)
def admin_create_scheme(
    scheme_in: SchemeCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin endpoint: Add a newly cataloged government scheme."""
    existing = db.query(Scheme).filter(Scheme.slug == scheme_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A scheme with this unique slug already exists."
        )
        
    scheme_data = scheme_in.dict()
    new_scheme = Scheme(**scheme_data, last_verified_at=datetime.utcnow())
    db.add(new_scheme)
    db.commit()
    db.refresh(new_scheme)
    
    # Create audit source record
    src = SchemeSource(
        scheme_id=new_scheme.id,
        source_url=new_scheme.source_url,
        source_type="admin_portal_entry",
        retrieved_at=datetime.utcnow(),
        verification_status=new_scheme.verification_status,
        notes=f"Added by admin {admin.email}"
    )
    db.add(src)
    db.commit()
    return new_scheme


@router.put("/schemes/{scheme_id}", response_model=SchemeResponse)
def admin_update_scheme(
    scheme_id: int,
    scheme_in: SchemeCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin endpoint: Update scheme details or criteria."""
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")
        
    for k, v in scheme_in.dict().items():
        setattr(scheme, k, v)
        
    scheme.last_verified_at = datetime.utcnow()
    db.commit()
    db.refresh(scheme)
    return scheme


@router.post("/schemes/{scheme_id}/verify", response_model=SchemeResponse)
def admin_verify_scheme(
    scheme_id: int,
    source_url: str,
    notes: str = "Verified against latest official gazette/portal guidelines",
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin endpoint: Formally verify and certify a scheme record with source timestamp."""
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")
        
    scheme.verification_status = "verified"
    scheme.source_url = source_url
    scheme.last_verified_at = datetime.utcnow()
    
    src = SchemeSource(
        scheme_id=scheme.id,
        source_url=source_url,
        source_type="admin_reverification",
        retrieved_at=datetime.utcnow(),
        verification_status="verified",
        notes=f"{notes} (Certified by {admin.email})"
    )
    db.add(src)
    db.commit()
    db.refresh(scheme)
    return scheme
