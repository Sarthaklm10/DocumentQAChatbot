from pydantic import BaseModel
class AskRequest(BaseModel):
    question:str
    session_id:str='default_session'
class AskResponse(BaseModel):
    answer:str
    session_id:str