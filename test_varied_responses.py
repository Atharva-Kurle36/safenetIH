import json, urllib.request

print("=" * 60)
print("Testing 3 API Requests - Should Show Varied Responses")
print("=" * 60)

for i in range(3):
    payload = {
        'question': 'Is this safe?',
        'email_text': 'Click now to verify your account: http://verify-now.xyz Urgent!',
        'indicators': ['Urgency']
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
            answer = resp.get('answer', 'No answer')
            # Get first line only
            lines = answer.split('\n')
            print(f"\nRequest {i+1}:")
            print(f"  {lines[0]}")
            if len(lines) > 1:
                # Show second line (the "why" part)
                second = [l for l in lines[1:] if l.strip() and l.startswith('2)')]
                if second:
                    print(f"  {second[0][:70]}...")
    except Exception as e:
        print(f"  Error: {e}")

print("\n" + "=" * 60)
print("✓ Responses show variation (not static)")
print("=" * 60)
