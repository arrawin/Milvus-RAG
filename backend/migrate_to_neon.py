import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

LOCAL_DB_URL = os.getenv("LOCAL_DATABASE_URL")
NEON_DB_URL = os.getenv("DATABASE_URL")

if not LOCAL_DB_URL:
    raise ValueError("LOCAL_DATABASE_URL not found in environment.")

if not NEON_DB_URL:
    raise ValueError("DATABASE_URL not found in environment.")

local_engine = create_engine(LOCAL_DB_URL)
neon_engine = create_engine(
    NEON_DB_URL,
    pool_pre_ping=True,
    pool_recycle=300
)

TABLES = [
    "regulations",
    "regulation_final",
    "policy_chunks"
]

for table in TABLES:
    print(f"Migrating {table}...")

    df = pd.read_sql_table(table, local_engine)

    df.to_sql(
        table,
        neon_engine,
        if_exists="replace",
        index=False
    )

    print(f"{table} migrated successfully.")

print("All selected tables migrated.")