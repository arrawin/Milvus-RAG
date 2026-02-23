from database import get_cursor
from embedding_model import embed
from milvus_service import insert_embedding

def ingest():
    cur = get_cursor()
    cur.execute("SELECT chunk_id, chunk_text FROM policy_chunks")
    rows = cur.fetchall()

    print(f"Embedding {len(rows)} chunks...")

    for chunk_id, text in rows:
        vector = embed(text)
        insert_embedding(chunk_id, vector)

    print("Ingestion complete.")

if __name__ == "__main__":
    ingest()