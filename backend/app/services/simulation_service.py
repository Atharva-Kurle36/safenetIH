import random


SIMULATION_SAMPLES = [
    {
        "type": "bank",
        "email_text": (
            "Subject: Urgent Bank Notice\n\n"
            "Dear Customer,\n"
            "We detected unusual activity on your account. Verify your password immediately "
            "using http://secure-bank-verify-login.com to avoid account suspension.\n\n"
            "Security Team"
        ),
        "explanation": [
            "Uses urgent language",
            "Contains suspicious link",
            "Requests sensitive info",
        ],
    },
    {
        "type": "job",
        "email_text": (
            "Subject: Congratulations! Selected for Remote Job\n\n"
            "Hello,\n"
            "You are pre-selected for a high-paying role. Click now to complete immediate onboarding "
            "and submit your bank details for salary processing: http://job-fast-track-now.com\n\n"
            "HR Desk"
        ),
        "explanation": [
            "Uses urgent language",
            "Contains suspicious link",
            "Requests sensitive info",
        ],
    },
    {
        "type": "security",
        "email_text": (
            "Subject: OTP Security Alert\n\n"
            "Dear User,\n"
            "Your account will be blocked immediately unless you confirm your OTP and password. "
            "Click now: http://secure-otp-check.com\n\n"
            "Support Center"
        ),
        "explanation": [
            "Uses urgent language",
            "Contains suspicious link",
            "Requests sensitive info",
        ],
    },
]


def generate_simulated_email() -> dict[str, object]:
    return random.choice(SIMULATION_SAMPLES)
