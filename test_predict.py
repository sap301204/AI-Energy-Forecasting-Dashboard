print("test file started")

import requests

url = "http://127.0.0.1:5000/predict"

data = {
    "hour": 14,
    "day": 2
}

try:
    response = requests.post(url, json=data, timeout=10)
    print("Status code:", response.status_code)
    print("Response text:", response.text)
except Exception as e:
    print("Error:", e)