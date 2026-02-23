from database import SessionLocal
from sqlalchemy import text
from embedding_model import embed
from milvus_service import insert_embedding


def ingest():
    db = SessionLocal()

    try:
        result = db.execute(text("SELECT chunk_id, chunk_text FROM policy_chunks"))
        rows = result.fetchall()

        print(f"Embedding {len(rows)} chunks...")

        for chunk_id, chunk_text in rows:
            vector = embed(chunk_text)
            insert_embedding(chunk_id, vector)

        print("Ingestion complete.")

    finally:
        db.close()


if __name__ == "__main__":
    ingest()