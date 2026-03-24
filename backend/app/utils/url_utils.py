import re
from urllib.parse import urlparse

import tldextract


def _has_brand_typo(domain: str) -> bool:
    normalized = domain.lower().replace("1", "l").replace("0", "o").replace("$", "s")
    suspicious_brands = ["paypal", "google", "microsoft", "amazon", "apple", "bank"]

    for brand in suspicious_brands:
        if brand in normalized and brand not in domain.lower():
            return True
    return False


def analyze_url(url: str) -> tuple[int, list[str]]:
    if not url.strip():
        return 0, []

    reasons: list[str] = []
    score = 0
    candidate = url.strip()

    if not re.match(r"^https?://", candidate, re.IGNORECASE):
        candidate = f"http://{candidate}"

    parsed = urlparse(candidate)
    netloc = parsed.netloc or ""

    if not parsed.scheme or not netloc:
        return 25, ["URL format appears invalid or incomplete."]

    if parsed.scheme.lower() == "http":
        score += 15
        reasons.append("URL uses HTTP instead of HTTPS.")

    if "@" in candidate:
        score += 20
        reasons.append("URL contains '@', which can hide real destination.")

    hyphen_count = netloc.count("-")
    if hyphen_count >= 2:
        score += 15
        reasons.append("Domain contains multiple hyphens, a common phishing pattern.")

    extracted = tldextract.extract(candidate)
    if not extracted.domain or not extracted.suffix:
        score += 20
        reasons.append("Domain could not be validated with a proper public suffix.")
    else:
        core_domain = extracted.domain

        if _has_brand_typo(core_domain):
            score += 25
            reasons.append("Domain resembles a misspelled brand name (possible spoof).")

        if re.search(r"\d", core_domain):
            score += 7
            reasons.append("Domain includes numeric substitutions often used in spoofing.")

    return min(score, 70), reasons
