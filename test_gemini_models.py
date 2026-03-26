import json
import urllib.request
import urllib.error

gemini_key = "AIzaSyBer1XKXqrOZk7nVEROAWcaj34EN2irJaQ"

payload = {
    "contents": [
        {
            "parts": [
                {"text": "Hello, classify as safe or phishing"}
            ]
        }
    ]
}

# Try different model names
models_to_try = [
    "gemini-pro",
    "gemini-1.5-pro",
    "text-bison-001",
]

for model in models_to_try:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_key}"
    print(f"\nTrying model: {model}")
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            body = response.read().decode("utf-8")
            result = json.loads(body)
            if "candidates" in result:
                text = result["candidates"][0]["content"]["parts"][0]["text"]
                print(f"SUCCESS! Response: {text[:100]}")
                break
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        error_msg = json.loads(error_body).get("error", {}).get("message", "Unknown error")
        print(f"  HTTP {e.code}: {error_msg[:80]}")
    except Exception as e:
        print(f"  Error: {type(e).__name__}: {str(e)[:80]}")
