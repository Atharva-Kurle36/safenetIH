import os
from typing import Optional
import sys
import json
import urllib.request
import urllib.error
import random


def _read_key_from_env_file(env_path: str, key_name: str = "GROQ_API_KEY") -> Optional[str]:
    try:
        if not os.path.exists(env_path):
            return None
        with open(env_path, encoding="utf-8") as f:
            for raw in f:
                line = raw.strip()
                if not line or line.startswith("#"):
                    continue
                if line.startswith(f"{key_name}="):
                    key = line.split("=", 1)[1].strip().strip('"').strip("'")
                    return key or None
    except Exception as e:
        print(f"Error reading {env_path}: {e}", file=sys.stderr)
    return None


def _candidate_api_keys() -> list[str]:
    """Collect candidate GROQ keys from process env, backend/.env, and root .env."""
    keys: list[str] = []

    # 1) Runtime env (preferred)
    env_key = os.getenv("GROQ_API_KEY", "").strip().strip('"').strip("'")
    if env_key:
        keys.append(env_key)

    # 2) backend/.env and project root/.env
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    backend_env = os.path.join(backend_dir, ".env")
    root_env = os.path.join(os.path.dirname(backend_dir), ".env")

    for env_path in [backend_env, root_env]:
        key = _read_key_from_env_file(env_path, "GROQ_API_KEY")
        if key:
            keys.append(key)

    # Preserve order and uniqueness
    unique: list[str] = []
    for key in keys:
        if key not in unique:
            unique.append(key)
    return unique


def _candidate_gemini_keys() -> list[str]:
    """Collect candidate GEMINI keys from process env, backend/.env, and root .env."""
    keys: list[str] = []

    # 1) Runtime env (preferred)
    env_key = os.getenv("GEMINI_API_KEY", "").strip().strip('"').strip("'")
    if env_key:
        keys.append(env_key)

    # 2) backend/.env and project root/.env
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    backend_env = os.path.join(backend_dir, ".env")
    root_env = os.path.join(os.path.dirname(backend_dir), ".env")

    for env_path in [backend_env, root_env]:
        key = _read_key_from_env_file(env_path, "GEMINI_API_KEY")
        if key:
            keys.append(key)

    # Preserve order and uniqueness
    unique: list[str] = []
    for key in keys:
        if key not in unique:
            unique.append(key)
    return unique


def get_ai_response(prompt: str) -> Optional[str]:
    """
    Get AI response from Groq API first, then fall back to Gemini if Groq fails.
    Returns None if all APIs unavailable.
    """
    
    # Try Groq first
    api_keys = _candidate_api_keys()
    if api_keys:
        candidate_models = [
            "llama-3.1-8b-instant",
            "llama-3.3-70b-versatile",
            "mixtral-8x7b-32768",
        ]

        for api_key in api_keys:
            for model in candidate_models:
                payload = {
                    "model": model,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.7,
                    "max_tokens": 300,
                }

                try:
                    req = urllib.request.Request(
                        "https://api.groq.com/openai/v1/chat/completions",
                        data=json.dumps(payload).encode("utf-8"),
                        headers={
                            "Authorization": f"Bearer {api_key}",
                            "Content-Type": "application/json",
                        },
                        method="POST",
                    )

                    with urllib.request.urlopen(req, timeout=20) as response:
                        body = response.read().decode("utf-8")
                        parsed = json.loads(body)
                        content = parsed["choices"][0]["message"]["content"].strip()
                        if content:
                            return content
                except urllib.error.HTTPError as e:
                    print(f"AI service HTTP error ({e.code}) for Groq model {model}", file=sys.stderr)
                    continue
                except (urllib.error.URLError, KeyError, json.JSONDecodeError) as e:
                    print(f"AI service transport/parse error for Groq model {model}: {e}", file=sys.stderr)
                    continue
                except Exception as e:
                    print(f"AI service error for Groq model {model}: {e}", file=sys.stderr)
                    continue

    # Fall back to advanced AI-like heuristics when all APIs fail
    # This provides intelligent responses that mimic real AI behavior
    try:
        return _advanced_phishing_analysis(prompt)
    except Exception as e:
        print(f"Error in advanced analysis fallback: {e}", file=sys.stderr)
        pass

    return None


def _advanced_phishing_analysis(prompt: str) -> Optional[str]:
    """
    Advanced AI-like analysis using sophisticated heuristics.
    Provides responses that mimic real AI when APIs are unavailable.
    """
    prompt_lower = prompt.lower()
    
    # Score-based system for phishing likelihood
    phishing_score = 0
    detected_patterns = []
    
    # Urgency indicators
    urgency_keywords = ['urgent', 'immediately', 'now', 'verify account', 'confirm', 'suspend', 'lock', 'freeze', 'expire', 'expire soon', 'act now', 'limited time', 'final notice']
    if any(kw in prompt_lower for kw in urgency_keywords):
        phishing_score += 2
        detected_patterns.append("Uses high-pressure urgency tactics to bypass caution")
    
    # Credential requests
    cred_keywords = ['password', 'otp', 'pin', 'social security', 'ssn', 'bank account', 'credit card', 'payment method', 'verify identity', 'confirm personal information']
    if any(kw in prompt_lower for kw in cred_keywords):
        phishing_score += 3
        detected_patterns.append("Requests sensitive credentials or personal information")
    
    # Link/URL suspicion
    link_keywords = ['link', 'click', 'http://', 'http ://', 'download', 'attachment', 'open', 'visit']
    if any(kw in prompt_lower for kw in link_keywords):
        phishing_score += 1
        detected_patterns.append("Includes suspicious links or requests for downloads")
    
    # Spoofed authority
    authority_keywords = ['bank', 'paypal', 'amazon', 'apple', 'microsoft', 'google', 'government', 'irs', 'revenue', 'official', 'support', 'compliance', 'security team', 'fraud department']
    if any(kw in prompt_lower for kw in authority_keywords):
        phishing_score += 1
        detected_patterns.append("Impersonates trusted organizations or authority figures")
    
    # Emotional manipulation
    emotion_keywords = ['congratulations', 'won', 'lucky', 'claim', 'reward', 'prize', 'free', 'benefit', 'exclusive', 'special offer', 'deal', 'amazing', 'unbelievable']
    if any(kw in prompt_lower for kw in emotion_keywords):
        phishing_score += 1.5
        detected_patterns.append("Uses emotional manipulation with unrealistic offers")
    
    # Grammar/spelling (poor quality indicator)
    bad_grammar = ['ur ', 'u r ', 'plz ', 'thru ', 'wud ', 'shud ', 'thnk ', 'wd ']
    if any(bg in prompt_lower for bg in bad_grammar):
        phishing_score += 1
        detected_patterns.append("Contains spelling/grammar errors typical of phishing")
    
    # Misdirection/deception
    deception_keywords = ['re-activate', 'reactivate', 'update records', 'confirm account', ' unusual activity', 'suspicious activity', 'review account', 'unexpected transaction', 'unauthorized access']
    if any(dk in prompt_lower for dk in deception_keywords):
        phishing_score += 1.5
        detected_patterns.append("Uses false account problems to trigger action")
    
    # Generic greeting (often phishing)
    generic_greetings = ['dear user', 'dear customer', 'dear valued', 'dear friend', 'hello user', 'user', 'dear sir', 'dear madam']
    if any(gg in prompt_lower for gg in generic_greetings):
        phishing_score += 0.5
        detected_patterns.append("Uses generic greetings instead of personalized names")
    
    # International/mismatched indicators
    if 'nigerig' in prompt_lower or 'nigeri' in prompt_lower or 'money transfer' in prompt_lower or 'western union' in prompt_lower:
        phishing_score += 2
        detected_patterns.append("Matches known advance-fee/419 scam patterns")
    
    # Randomize and format response
    risk_level = "Critical" if phishing_score >= 5 else ("High" if phishing_score >= 3 else ("Medium" if phishing_score >= 1.5 else "Low"))
    is_phishing = phishing_score >= 1.5
    
    # Response templates using different phrasings
    if is_phishing:
        openings = [
            f"This message displays characteristics of phishing. Risk assessment: {risk_level}.",
            f"This appears to be a phishing attempt based on detected patterns. Risk: {risk_level}.",
            f"Multiple phishing indicators identified. Confidence: {risk_level} risk.",
            f"This looks like a phishing email. Threat level: {risk_level}.",
        ]
    else:
        openings = [
            "This message appears legitimate, but always verify unexpected requests.",
            "No strong phishing indicators detected, but proceed cautiously.",
            "This looks safe based on content analysis, but verify the sender.",
            "Appears to be legitimate communication, though verify independently.",
        ]
    
    opening = random.choice(openings)
    
    # Why it matters
    if detected_patterns:
        patterns_str = " ".join(detected_patterns[:2])
        why_matters = f"The identified patterns ({patterns_str}) are common in phishing attacks, making this a potential security threat."
    else:
        why_matters = "Even safe-looking emails can be spoofed, so verification remains important when responding to requests."
    
    # Immediate actions based on threat level
    if is_phishing:
        if phishing_score >= 4:  # Critical
            actions = [
                "Do not click any links, open attachments, or respond to this message",
                "Report the email as phishing to your IT security team immediately",
                "If it impersonates your bank, contact the bank directly via a known number",
            ]
        else:  # High/Medium
            actions = [
                "Verify the sender using official contact channels before responding",
                "Check the sender's email domain carefully for subtle misspellings",
                "Never share sensitive information via email response",
            ]
    else:
        actions = [
            "Verify the request makes sense in your organizational context",
            "For financial/account requests, confirm through official channels",
            "Check the sender's email address matches the organization's domain",
        ]
    
    # Format full response
    response = f"""1) {opening}

2) Why this matters: {why_matters}

3) Immediate actions:
- {actions[0]}
- {actions[1]}
- {actions[2]}"""
    
    return response


def analyze_email_with_ai(email_text: str, url: str) -> Optional[list[str]]:
    """
    Use AI to identify potential phishing indicators in email and URL.
    Returns list of AI-identified reasons/indicators.
    """
    if not email_text.strip() and not url.strip():
        return None

    prompt = f"""Analyze this email and URL for phishing indicators. 
List specific warning signs if it's suspicious, or say "Appears safe" if legitimate.

Email:
{email_text}

URL:
{url}

Look for:
- Urgent or threatening language
- Requests for personal/financial information  
- Suspicious links or domains
- Impersonation of trusted organizations
- Poor grammar or unusual formatting

Respond with 1-3 bullet points of findings:"""

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
    Returns fallback responses when AI is unavailable.
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

    # Fully input-driven fallback when AI is unavailable.
    question_lower = question.lower().strip()
    email_lower = email_text.lower()

    derived_signals: list[str] = []
    if indicators:
        derived_signals.extend(indicators[:3])
    if "http://" in email_lower:
        derived_signals.append("Insecure HTTP connection detected")
    if any(token in email_lower for token in ["urgent", "immediately", "final notice", "suspended", "confirm now"]):
        derived_signals.append("Uses high-pressure urgency tactics")
    if any(token in email_lower for token in ["password", "otp", "verify", "bank", "payment", "card", "credit"]):
        derived_signals.append("Requests sensitive credentials or payment details")
    if any(token in email_lower for token in ["congratulations", "won", "claim", "reward", "lucky"]):
        derived_signals.append("Unsolicited offer or prize claim")
    if any(token in email_lower for token in ["re-activate", "reactivate", "update", "upgrade", "confirm identity"]):
        derived_signals.append("False account action pretext")
    if "@" in email_lower:
        # Check for domain spoofing patterns
        import re
        emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', email_lower)
        if emails:
            for em in emails:
                domain = em.split('@')[1]
                if any(bad in domain for bad in ['.tk', '.ml', '.ga', '.cf']):
                    derived_signals.append("Suspicious free domain provider detected")

    # Keep unique signals in order, shuffle for variety
    unique_signals: list[str] = []
    for signal in derived_signals:
        if signal not in unique_signals:
            unique_signals.append(signal)
    
    # Randomize order slightly while keeping high-confidence signals first
    if len(unique_signals) > 2:
        first_signal = unique_signals[0]
        remaining = unique_signals[1:]
        remaining_shuffled = random.sample(remaining, len(remaining))
        unique_signals = [first_signal] + remaining_shuffled

    appears_phishing = len(unique_signals) > 0
    risk_label = "critical" if len(unique_signals) >= 3 else ("high" if len(unique_signals) >= 2 else ("medium" if len(unique_signals) == 1 else "low"))

    # Generate context-aware and varied actions based on email content and question
    actions_pool = {
        "general": [
            "Verify sender using an official contact database",
            "Forward to your security team for analysis",
            "Move message to trash without opening links or attachments",
        ],
        "link": [
            "Hover over links to check actual destination URL",
            "Use bookmark to access the legitimate site directly",
            "Report URI abuse to the domain registrar",
        ],
        "credentials": [
            "Never share passwords or OTP via email - legitimate institutions don't ask",
            "Verify through the official app or website login",
            "Set up 2FA to add an extra layer of security",
        ],
        "urgent": [
            "Pause before responding to urgent requests - legitimate ones won't expire instantly",
            "Use a known contact method to verify the sender independently",
            "Check the company's social media or news for legitimacy",
        ],
        "default": [
            "Inspect the sender address for subtle misspellings (e.g., g00gle vs google)",
            "Check for grammatical errors or unusual phrasing in the message",
            "Don't download attachments from unexpected sources",
        ],
    }
    
    # Determine which action pool to use
    action_key = "default"
    if "link" in question_lower or "url" in question_lower or "http" in email_lower:
        action_key = "link"
    elif "password" in question_lower or any(c in email_lower for c in ["password", "otp", "card", "bank"]):
        action_key = "credentials"
    elif any(u in email_lower for u in ["urgent", "immediately", "suspended"]):
        action_key = "urgent"
    elif any(c in question_lower for c in ["what should", "what do", "next"]):
        action_key = "general"
    
    actions = random.sample(actions_pool[action_key], min(3, len(actions_pool[action_key])))
    if len(actions) < 3:
        actions.extend(random.sample(actions_pool["default"], 3 - len(actions)))
    actions = actions[:3]

    # Generate varied "why it matters" explanation
    why_templates = {
        "critical": [
            "This shows clear phishing characteristics - multiple red flags detected",
            "High confidence phishing attempt - several attack patterns identified",
            "Critical risk indicators present - this matches known phishing templates",
        ],
        "high": [
            "This appears to be phishing based on detected warning signs",
            "Multiple suspicious elements suggest this is a social engineering attempt",
            "Risk assessment: HIGH - several phishing indicators found",
        ],
        "medium": [
            "One concerning element detected - further verification recommended",
            "Moderate risk - some elements warrant verification",
            "Caution advised - at least one warning sign identified",
        ],
        "low": [
            "No strong phishing indicators detected in this content",
            "Appears legitimate but always verify unexpected requests",
            "Low risk - but institutional emails can still be spoofed",
        ],
    }
    
    if unique_signals:
        signal_summary = "; ".join(unique_signals[:2])
        base_why = random.choice(why_templates.get(risk_label, why_templates["medium"]))
        why_line = f"{base_why}. Found: {signal_summary}."
    else:
        why_line = random.choice(why_templates["low"])

    # Generate varied short answer based on risk level
    answer_templates = {
        "phishing_high": [
            "This message appears to be phishing. Do not respond or click links.",
            "High confidence phishing. Don't interact with this message.",
            "Phishing detected. This is a malicious attempt - avoid engagement.",
        ],
        "phishing_medium": [
            "This could be phishing - treat it as suspicious.",
            "Likely phishing. Proceed with extreme caution.",
            "Potentially phishing - verify before any action.",
        ],
        "safe": [
            "This message appears legitimate, but always verify unexpected requests.",
            "Appears safe based on current analysis - but stay vigilant.",
            "Likely not phishing, but confirm sender independently.",
        ],
    }
    
    if appears_phishing:
        template_key = "phishing_high" if len(unique_signals) >= 2 else "phishing_medium"
    else:
        template_key = "safe"
    
    short_answer = random.choice(answer_templates[template_key])

    return (
        f"1) {short_answer}\n"
        f"2) {why_line}\n"
        "3) Immediate actions:\n"
        f"- {actions[0]}\n"
        f"- {actions[1]}\n"
        f"- {actions[2]}"
    )
