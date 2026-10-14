from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models import User, UserProfile
from app.schemas import ChatRequest, ChatResponse
from app.services.ai_assistant import generate_chat_response
from app.dependencies import get_optional_user

router = APIRouter(prefix="/assistant", tags=["AI Assistant"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(
    request: ChatRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Conversational RAG assistant grounded in official government scheme documentation.
    Provides verified source citations, eligibility explanations, and actionable guidance.
    """
    user_profile = None
    lang = request.user_language or "en"
    
    if current_user:
        user_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        if current_user.preferred_language and not request.user_language:
            lang = current_user.preferred_language
            
    result = await generate_chat_response(
        message=request.message,
        db=db,
        user_profile=user_profile,
        language=lang
    )
    
    return ChatResponse(
        answer=result["answer"],
        cited_schemes=result["cited_schemes"],
        follow_up_suggestions=result["follow_up_suggestions"]
    )
