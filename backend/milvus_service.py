import os
from pymilvus import connections, Collection
from dotenv import load_dotenv

load_dotenv()

MILVUS_URI = os.getenv("MILVUS_URI")
MILVUS_TOKEN = os.getenv("MILVUS_TOKEN")

if not MILVUS_URI or not MILVUS_TOKEN:
    raise ValueError("Milvus credentials not found in environment variables.")

connections.connect(
    alias="default",
    uri=MILVUS_URI,
    token=MILVUS_TOKEN
)

collection = Collection("policy_embeddings")

def insert_embedding(chunk_id, vector):
    collection.insert([[chunk_id], [vector]])

def search(vector, limit=5):
    results = collection.search(
        data=[vector],
        anns_field="embedding",
        param={
            "metric_type": "COSINE",
            "params": {"ef": 64}
        },
        limit=limit
    )
    return [hit.id for hit in results[0]]