from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from database import SessionLocal
from embedding_model import embed
from milvus_service import search
from llm_service import generate_answer

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Compliance Intelligence API running"}

@app.post("/query")
def query(payload: QueryRequest, db: Session = Depends(get_db)):

    user_query = payload.query

    # Jurisdiction detection
    jurisdiction = None
    q_lower = user_query.lower()

    if "eu" in q_lower or "gdpr" in q_lower:
        jurisdiction = "EU"
    elif "us" in q_lower or "hipaa" in q_lower:
        jurisdiction = "US"
    elif "india" in q_lower or "dpdp" in q_lower:
        jurisdiction = "India"

    # Embed query
    vector = embed(user_query)

    # Search Milvus
    chunk_ids = search(vector)

    if not chunk_ids:
        return {"message": "No relevant results found"}

    # Fetch structured data
    if jurisdiction:
        result = db.execute(
            text("""
                SELECT chunk_id, chunk_text
                FROM policy_chunks
                WHERE chunk_id = ANY(:ids)
                AND jurisdiction = :jurisdiction
            """),
            {"ids": chunk_ids, "jurisdiction": jurisdiction}
        )
    else:
        result = db.execute(
            text("""
                SELECT chunk_id, chunk_text
                FROM policy_chunks
                WHERE chunk_id = ANY(:ids)
            """),
            {"ids": chunk_ids}
        )

    rows = result.fetchall()

    response_chunks = [
        {"chunk_id": row[0], "text": row[1]}
        for row in rows
    ]

    if not response_chunks:
        return {"message": "No relevant structured results found"}

    # LLM reasoning
    answer = generate_answer(user_query, response_chunks)

    return {
        "query": user_query,
        "jurisdiction_detected": jurisdiction,
        "answer": answer
    }