import re


URGENCY_WORDS = ["urgent", "verify", "immediately", "click now"]
SENSITIVE_INFO_WORDS = ["password", "bank", "otp"]
ADDITIONAL_THREAT_WORDS = ["suspend", "restricted", "confirm", "security alert"]


def _match_keywords(text: str, keywords: list[str]) -> list[str]:
    found: list[str] = []
    lower_text = text.lower()

    for keyword in keywords:
        if " " in keyword:
            if keyword in lower_text:
                found.append(keyword)
            continue

        if re.search(rf"\b{re.escape(keyword)}\b", lower_text):
            found.append(keyword)

    return found


def analyze_email_text(text: str) -> tuple[int, list[str], list[str]]:
    if not text.strip():
        return 0, [], []

    reasons: list[str] = []
    highlights: list[str] = []
    score = 0

    urgency_hits = _match_keywords(text, URGENCY_WORDS)
    if urgency_hits:
        score += min(30, len(urgency_hits) * 10)
        reasons.append("Urgent or pressure-based wording detected in email text.")
        highlights.extend(urgency_hits)

    sensitive_hits = _match_keywords(text, SENSITIVE_INFO_WORDS)
    if sensitive_hits:
        score += min(30, len(sensitive_hits) * 12)
        reasons.append("Email appears to request sensitive information.")
        highlights.extend(sensitive_hits)

    extra_hits = _match_keywords(text, ADDITIONAL_THREAT_WORDS)
    if extra_hits:
        score += min(15, len(extra_hits) * 5)
        reasons.append("Additional suspicious security-themed keywords were found.")
        highlights.extend(extra_hits)

    exclamation_count = text.count("!")
    uppercase_words = re.findall(r"\b[A-Z]{4,}\b", text)
    if exclamation_count >= 3 or len(uppercase_words) >= 2:
        score += 10
        reasons.append("Suspicious tone detected through excessive urgency formatting.")

    return min(score, 70), reasons, highlights
