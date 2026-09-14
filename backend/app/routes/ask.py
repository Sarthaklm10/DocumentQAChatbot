from IPython.core import payload
import os
from fastapi import APIRouter
from app.schemas.ask import AskRequest,AskResponse
from app.services.rag_service import ask_question

router = APIRouter()
@router.post('/ask',response_model=AskResponse)
def askquestion(payload:AskRequest):
    ques=payload.question
    session_id=payload.session_id
    
    answer=ask_question(ques,session_id)
    return AskResponse(
        answer=answer,
        session_id=session_id
    )