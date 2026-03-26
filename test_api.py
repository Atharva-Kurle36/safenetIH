import json
import urllib.request
import urllib.error

gemini_key = "AIzaSyBer1XKXqrOZk7nVEROAWcaj34EN2irJaQ"

payload = {
    "contents": [
        {
            "parts": [
                {"text": "Hello, classify this as safe or phishing: test email"}
            ]
        }
    ]
}

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"

print(f"Testing Gemini API...")
print(f"URL: {url[:80]}...")

try:
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=10) as response:
        body = response.read().decode("utf-8")
        print("SUCCESS! Response:")
        print(json.loads(body))
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}")
    print(f"Response: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")
