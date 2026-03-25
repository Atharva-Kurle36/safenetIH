import os
from typing import Optional


def get_ai_response(prompt: str) -> Optional[str]:
    """
    Get AI response from Groq API for enhanced analysis.
    Falls back gracefully if API key is missing or request fails.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None

    try:
        from groq import Groq

        client = Groq(api_key=api_key)
        completion = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            temperature=0.7,
            max_tokens=300,
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"AI service error: {e}")
        return None


def analyze_email_with_ai(email_text: str, url: str) -> Optional[list[str]]:
    """
    Use AI to identify potential phishing indicators in email and URL.
    Returns list of AI-identified reasons/indicators.
    """
    if not email_text.strip() and not url.strip():
        return None

    prompt = f"""Analyze this email and URL for phishing indicators. 
Be concise and list 1-2 key warning signs if it's suspicious, or confirm it appears safe.

Email:
{email_text}

URL:
{url}

Respond with ONLY the warning signs or safety assessment, no preamble."""

    response = get_ai_response(prompt)
    if response:
        # Split response into bullet points
        lines = response.strip().split("\n")
        reasons = [line.strip("- •* ") for line in lines if line.strip()]
        return reasons[:3]  # Limit to 3 reasons
    return None


def generate_simulation_with_ai(phishing_type: str = "general") -> Optional[dict]:
    """
    Use AI to generate realistic phishing simulation email.
    Returns dict with email_text, type, and explanation.
    """
    type_prompts = {
        "bank": "a phishing email impersonating a bank requesting immediate password verification",
        "job": "a phishing email about a fake high-paying job offer requesting personal/financial details",
        "security": "a phishing email claiming security issues and requesting OTP or 2FA codes",
        "general": "a realistic phishing email trying to trick users",
    }

    prompt_suffix = type_prompts.get(phishing_type, type_prompts["general"])

    prompt = f"""Create {prompt_suffix}. 

Format your response EXACTLY as:
EMAIL_TEXT:
[Complete realistic email with subject and body]

Red flags:
[List 2-3 specific warning signs of this phishing attempt]

Keep email under 200 words. Make it realistic but clearly identifiable as phishing."""

    response = get_ai_response(prompt)
    if not response:
        return None

    try:
        # Parse response
        sections = response.split("Red flags:")
        if len(sections) < 2:
            return None

        email_part = sections[0].replace("EMAIL_TEXT:", "").strip()
        flags_part = sections[1].strip()

        # Extract flags
        flags = [
            line.strip("- •* ") 
            for line in flags_part.split("\n") 
            if line.strip() and not line.lower().startswith("email")
        ]

        return {
            "email_text": email_part,
            "type": phishing_type,
            "explanation": flags[:3],
        }
    except Exception as e:
        print(f"Simulation generation error: {e}")
        return None
