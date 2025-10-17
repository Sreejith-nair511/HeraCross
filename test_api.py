import requests
import json

# Test the health endpoint
response = requests.get("http://localhost:8000/health")
print("Health check:", response.json())

# Test the chat endpoint
messages = [
    {"role": "user", "content": "hello"}
]

try:
    response = requests.post(
        "http://localhost:8000/api/v1/inference/chat",
        headers={"Content-Type": "application/json"},
        data=json.dumps(messages)
    )
    print("Chat response:", response.status_code, response.json())
except Exception as e:
    print("Chat error:", e)