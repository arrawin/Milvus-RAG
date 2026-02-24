from pymilvus import Collection

COLLECTION_NAME = "policy_embeddings"


def get_collection():
    return Collection(COLLECTION_NAME)


def insert_embedding(chunk_id, vector):
    collection = get_collection()
    collection.insert([[chunk_id], [vector]])


def search(vector, limit=5):
    collection = get_collection()

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