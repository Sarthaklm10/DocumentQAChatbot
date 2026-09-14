import os 
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
from app.services.pdf_service import process_pdf

load_dotenv()
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
VECTORSTORE_PATH = "data/vectorstore"

def update_vectorstore(file_path:str):
    # 1. Load & split the uploaded PDF into chunks
    chunks=process_pdf(file_path)
    if os.path.exists(VECTORSTORE_PATH) and os.path.exists(os.path.join(VECTORSTORE_PATH, "index.faiss")):
        # Load existing index & add new chunks
        vectorstore = FAISS.load_local(
            VECTORSTORE_PATH, 
            embeddings, 
            allow_dangerous_deserialization=True
        )
        vectorstore.add_documents(chunks)
    else:
        # Create new vectorstore index
        vectorstore = FAISS.from_documents(chunks, embeddings)
    
    # 3. Save updated vectorstore to disk
    vectorstore.save_local(VECTORSTORE_PATH)
    print(f"Added {len(chunks)} chunks from {file_path} to FAISS index!")
    return vectorstore