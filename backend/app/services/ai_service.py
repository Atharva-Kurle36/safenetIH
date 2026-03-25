import os
from typing import Optional
import sys


# Ensure GROQ_API_KEY is available by reading from .env if needed
def _ensure_api_key():
    """Load API key from environment or .env file"""
    if os.getenv("GROQ_API_KEY"):
        return os.getenv("GROQ_API_KEY")
    
    # Try to read from .env file directly
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    env_file = os.path.join(backend_dir, '.env')
    try:
        if os.path.exists(env_file):
            with open(env_file) as f:
                for line in f:
                    if line.startswith('GROQ_API_KEY='):
                        key = line.split('=', 1)[1].strip()
                        os.environ['GROQ_API_KEY'] = key
                        return key
    except Exception as e:
        print(f"Error reading .env: {e}", file=sys.stderr)
    
    return None


def get_ai_response(prompt: str) -> Optional[str]:
    """
    Get AI response from Groq API for enhanced analysis.
    Falls back gracefully if API key is missing or request fails.
    """
    api_key = _ensure_api_key()
    print(f"DEBUG: GROQ_API_KEY = {api_key[:20] if api_key else 'NOT FOUND'}", file=sys.stderr)
    if not api_key:
        print("DEBUG: API key could not be loaded", file=sys.stderr)
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


def get_simulation_assistant_answer(
    question: str,
    email_text: str = "",
    indicators: Optional[list[str]] = None,
) -> Optional[str]:
    """
    Provide defensive cybersecurity guidance for phishing simulation questions.
    Returns None when AI is unavailable so the API can report a service error.
    """
    indicators = indicators or []

    prompt = f"""You are a cybersecurity awareness assistant inside a phishing training simulator.
Your goal is to help users prevent phishing attacks and improve safe behavior.

Rules:
- Give only defensive, prevention-oriented advice.
- Do not provide offensive guidance, exploit steps, malware instructions, or evasion tactics.
- Keep answers practical and concise.
- Use simple language suitable for non-security users.
- If uncertain, say what to verify and provide safe next actions.

Simulation email:
{email_text}

Known indicators:
{', '.join(indicators) if indicators else 'None provided'}

User question:
{question}

Respond in this format:
1) Short answer (1-2 lines)
2) Why it matters (1-2 lines)
3) Immediate actions (3 bullet points)
"""

    response = get_ai_response(prompt)
    if response and response.strip():
        return response.strip()

    return None
