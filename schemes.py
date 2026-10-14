from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import or_

from app.database import get_db
from app.models import Scheme, UserProfile, User
from app.schemas import SchemeResponse, SchemeMatchResult, UserProfileBase
from app.services.eligibility_engine import evaluate_scheme_eligibility
from app.dependencies import get_optional_user

router = APIRouter(prefix="/schemes", tags=["Schemes"])

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    """Retrieve available scheme categories with count of verified schemes."""
    schemes = db.query(Scheme).filter(Scheme.is_active == True).all()
    categories: dict[str, int] = {}
    for s in schemes:
        categories[s.category] = categories.get(s.category, 0) + 1
    return [{"category": k, "count": v} for k, v in sorted(categories.items())]


@router.get("", response_model=List[SchemeResponse])
def list_schemes(
    category: Optional[str] = None,
    state: Optional[str] = None,
    search: Optional[str] = None,
    government_level: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """List schemes with category, state, search, and government level filters."""
    query = db.query(Scheme).filter(Scheme.is_active == True)
    
    if category and category.lower() != "all":
        query = query.filter(Scheme.category.ilike(f"%{category}%"))
        
    if state and state.lower() != "all":
        query = query.filter(or_(
            Scheme.state_scope.ilike("All-India"),
            Scheme.state_scope.ilike(f"%{state}%")
        ))
        
    if government_level and government_level.lower() != "all":
        query = query.filter(Scheme.government_level.ilike(government_level))
        
    if search:
        search_term = f"%{search}%"
        query = query.filter(or_(
            Scheme.name.ilike(search_term),
            Scheme.description.ilike(search_term),
            Scheme.department.ilike(search_term),
            Scheme.benefit_description.ilike(search_term)
        ))
        
    return query.order_by(Scheme.id.asc()).offset(offset).limit(limit).all()


@router.get("/{scheme_id}", response_model=SchemeResponse)
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    """Retrieve full details of a specific verified government scheme."""
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id, Scheme.is_active == True).first()
    if not scheme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with ID {scheme_id} not found."
        )
    return scheme


@router.post("/match", response_model=List[SchemeMatchResult])
def match_schemes(
    inline_profile: Optional[UserProfileBase] = None,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Evaluates eligibility across all active schemes against a citizen profile.
    Can use the authenticated user's stored profile or an ad-hoc profile submitted in the body.
    """
    target_profile = None
    
    if inline_profile:
        # Create an in-memory UserProfile object for evaluation
        target_profile = UserProfile(**inline_profile.dict())
    elif current_user:
        target_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        
    if not target_profile:
        target_profile = UserProfile()  # empty evaluation for general view
        
    schemes = db.query(Scheme).filter(Scheme.is_active == True).all()
    results: List[SchemeMatchResult] = []
    
    for s in schemes:
        eval_res = evaluate_scheme_eligibility(s, target_profile)
        results.append(SchemeMatchResult(
            scheme=s,
            eligibility_status=eval_res["eligibility_status"],
            relevance_score=eval_res["relevance_score"],
            matched_criteria=eval_res["matched_criteria"],
            failed_criteria=eval_res["failed_criteria"],
            missing_fields=eval_res["missing_fields"],
            summary_explanation=eval_res["summary_explanation"],
            official_application_url=eval_res["official_application_url"],
            verification_date=eval_res["verification_date"]
        ))
        
    # Sort by relevance score descending
    results.sort(key=lambda x: x.relevance_score, reverse=True)
    return results
