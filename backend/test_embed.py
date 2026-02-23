from embedding_model import embed
from milvus_service import search

query = "breach notification requirements in EU"

vector = embed(query)
results = search(vector)

print("Top chunk IDs:", results)