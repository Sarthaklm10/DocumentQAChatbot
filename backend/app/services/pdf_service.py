import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
# Dynamically construct absolute path to backend/data/uploads/test.pdf
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PDF_PATH = os.path.join(BASE_DIR, "data", "uploads", "test.pdf")

def load_pdf(file_path:str):
    loader=PyPDFLoader(file_path)
    documents=loader.load()
    return documents

def split_pdf(documents:list):
    text_splitter=RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=80,
        separators=['\n\n','\n','.',',',' ']
    )
    chunks=text_splitter.split_documents(documents)
    return chunks

def process_pdf(file_path:str=PDF_PATH):
    docs=load_pdf(file_path)
    chunks=split_pdf(docs)
    print(f"Loaded {len(docs)} pages, created {len(chunks)} chunks.")
    return chunks