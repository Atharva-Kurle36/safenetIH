import sys
sys.path.insert(0, '.')
from app.services.ai_service import get_simulation_assistant_answer

# Test with phishing email
phishing_email = "Dear User, Click here immediately to verify your PayPal account or it will be suspended. http://verify-paypal-now.xyz"

print("=== Testing Enhanced AI Assistant ===\n")

for i in range(3):
    print(f"Response {i+1}:")
    response = get_simulation_assistant_answer(
        question="Is this email safe?",
        email_text=phishing_email,
        indicators=["Suspicious domain", "Urgency language"]
    )
    print(response)
    print("\n" + "="*50 + "\n")
