from pymilvus import (
    connections,
    FieldSchema,
    CollectionSchema,
    DataType,
    Collection,
    utility
)
import os
from dotenv import load_dotenv

load_dotenv()

MILVUS_URI = os.getenv("MILVUS_URI")
MILVUS_TOKEN = os.getenv("MILVUS_TOKEN")

connections.connect(
    alias="default",
    uri=MILVUS_URI,
    token=MILVUS_TOKEN
)

COLLECTION_NAME = "policy_embeddings"

# If collection exists, drop it (optional during dev)
if utility.has_collection(COLLECTION_NAME):
    utility.drop_collection(COLLECTION_NAME)

# Define fields
fields = [
    FieldSchema(
        name="chunk_id",
        dtype=DataType.INT64,
        is_primary=True,
        auto_id=False
    ),
    FieldSchema(
        name="embedding",
        dtype=DataType.FLOAT_VECTOR,
        dim=384
    ),
]

schema = CollectionSchema(fields, description="Compliance policy embeddings")

collection = Collection(
    name=COLLECTION_NAME,
    schema=schema
)

# Create index
index_params = {
    "metric_type": "COSINE",
    "index_type": "HNSW",
    "params": {"M": 8, "efConstruction": 64}
}

collection.create_index(
    field_name="embedding",
    index_params=index_params
)

collection.load()

print("Milvus collection created successfully.")