import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS 
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain

load_dotenv()

embeddings= HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    temperature=0.3
)

# 3. Create Prompt with Context and Chat History
system_prompt = '''You are a helpful assistant. Answer the user's  question based ONLY on the following retrieved document context. If the answer is not contained in the context, say <I couldn't find the answer in the uploaded document>
Context: {context}
'''

prompt=ChatPromptTemplate.from_messages([
    ('system',system_prompt),
    MessagesPlaceholder(variable_name='history'),
    ('user','{input}')
])

# Session History Store & Helper
store={}
def get_session_history(session_id:int)->InMemoryChatMessageHistory:
    chat_history=store.get(session_id)
    if chat_history is None:
        chat_history=InMemoryChatMessageHistory()
        store[session_id]=chat_history
    return chat_history


# Helper function for API route
def ask_question(question: str, session_id: str = "default_session"):
    vectorstore_path='data/vectorstore'
    index_file = os.path.join(vectorstore_path, "index.faiss")

    if not os.path.exists(index_file):
        return "No documents uploaded yet! Please upload a PDF document first."
    
    # Load vectorstore dynamically
    vectorstore=FAISS.load_local(
        vectorstore_path,
        embeddings,
        # allow_dangerous_deserialization=True is required by LangChain when loading pkl files locally
        allow_dangerous_deserialization=True
    )

    retriver=vectorstore.as_retriever(
        search_type='similarity',
        search_kwargs={
            'k':4
        }
    )

    # Build Document Chain & Retrieval Chain
    docs_chain=create_stuff_documents_chain(llm,prompt)
    retrieval_chain=create_retrieval_chain(retriver,docs_chain)

    # Wrap Chain with RunnableWithMessageHistory
    final_chain=RunnableWithMessageHistory(
        retrieval_chain,
        get_session_history,
        input_messages_key='input',
        history_messages_key='history',
        output_messages_key='answer'
    )

    response = final_chain.invoke(
        {"input": question},
        config={"configurable": {"session_id": session_id}}
    )
    return response["answer"]

# Test execution
# if __name__ == "__main__":
#     answer = ask_question("What is CMM and ISO 9001?", session_id="test123")
#     print("Answer:", answer)