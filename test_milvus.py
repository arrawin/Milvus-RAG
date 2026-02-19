from pymilvus import *

connections.connect("default", host="localhost", port="19530")

fields = [
    FieldSchema(name="id", dtype=DataType.INT64, is_primary=True),
    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=4)
]

schema = CollectionSchema(fields)
collection = Collection("test_collection", schema)

print("Collection created!")
