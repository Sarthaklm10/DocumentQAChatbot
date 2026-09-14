from datetime import datetime
from pydantic import BaseModel,ConfigDict

class DocumentResponse(BaseModel):
    id:int
    filename:str
    filepath:str
    upload_date:datetime
    
    # Allows pydantic to read SQLAlchemy ORM objects
    model_config=ConfigDict(from_attributes=True)