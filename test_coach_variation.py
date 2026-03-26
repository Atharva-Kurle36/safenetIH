import json
import urllib.request

print("=" * 70)
print("TESTING: Asking the same question multiple times")
print("=" * 70)

# First, get a simulation
print("\n1️⃣ Loading simulation...")
req = urllib.request.Request('http://127.0.0.1:8000/simulate')
with urllib.request.urlopen(req, timeout=5) as r:
    sim = json.loads(r.read().decode('utf-8'))
    email = sim['email_text']
    indicators = sim.get('explanation', [])
    print(f"   Email: {email[:60]}...")
    print(f"   Indicators: {indicators}")

# Ask the same question 5 times
question = "Is this phishing?"
print(f"\n2️⃣ Asking same question 5 times: '{question}'")
print("-" * 70)

responses = []
for i in range(5):
    payload = {
        'question': question,
        'email_text': email,
        'indicators': indicators,
    }
    
    req = urllib.request.Request(
        'http://127.0.0.1:8000/simulate/assistant',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    with urllib.request.urlopen(req, timeout=5) as r:
        resp = json.loads(r.read().decode('utf-8'))
        first_line = resp['answer'].split('\n')[0]
        responses.append(first_line)
        print(f"   Response {i+1}: {first_line}")

print("-" * 70)
unique = len(set(responses))
print(f"\nResult: {unique} unique responses (should be > 1 for variation)")
if unique == 1:
    print("❌ STATIC - Same response every time!")
else:
    print(f"✅ VARYING - {unique} different responses!")
