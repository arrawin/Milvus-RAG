import os
import requests
from dotenv import load_dotenv



load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found.")

# ✅ Use Groq native endpoint
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

# ✅ Use a production model
MODEL = "llama-3.1-8b-instant"


def generate_answer(query: str, chunks: list):

    context = "\n\n".join([chunk["text"] for chunk in chunks])

    prompt = f"""
You are a professional compliance intelligence assistant.

Answer the user query strictly using the provided regulatory context.
Do NOT mention chunk numbers.
Do NOT explain the retrieval process.
Do NOT speculate beyond the provided text.

If the context does not directly answer the question, say:
"The provided regulatory context does not explicitly define this."

User Query:
{query}

Regulatory Context:
{context}

Provide a clear, structured compliance answer suitable for a corporate audience.
"""

    response = requests.post(
        GROQ_URL,
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": MODEL,
            "messages": [
                {"role": "system", "content": "You are a compliance expert."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
        },
        timeout=60,
    )

    if response.status_code != 200:
        return {
            "llm_error": f"Groq returned {response.status_code}",
            "details": response.text,
        }

    data = response.json()

    return data["choices"][0]["message"]["content"]