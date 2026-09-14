from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine,Base
import app.db.models
from app.routes.upload import router as upload_router
from app.routes.ask import router as ask_router

app=FastAPI(title='Document-QA-Chatbot')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router,prefix="/api",tags=['Documents'])
app.include_router(ask_router,prefix='/api',tags=["Q&A"])

Base.metadata.create_all(bind=engine)

@app.get('/')
def welcome():
    return {
        'message':'WELCOME'
    }
