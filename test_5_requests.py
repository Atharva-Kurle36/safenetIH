import json, urllib.request

print("Testing 5 consecutive requests to verify response variation...\n")

test_email = "Urgent: Verify your PayPal account now or it will be suspended. http://verify-paypal.xyz"

responses_seen = []

for i in range(5):
    payload = {
        'question': 'Is this phishing?',
        'email_text': test_email,
        'indicators': []
    }
    
    req = urllib.request.Request(
        'http://127.0.0.1:8000/simulate/assistant',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            resp = json.loads(r.read().decode('utf-8'))
            answer = resp.get('answer', '').split('\n')[0]  # First line only
            responses_seen.append(answer)
            print(f"Request {i+1}: {answer}")
    except Exception as e:
        print(f"Request {i+1}: ERROR - {e}")

print("\n" + "="*60)
unique_responses = len(set(responses_seen))
print(f"Unique responses: {unique_responses} out of 5")
if unique_responses > 1:
    print("✓ Responses are VARYING (good!)")
else:
    print("✗ Responses are STATIC (problem!)")
print("="*60)
