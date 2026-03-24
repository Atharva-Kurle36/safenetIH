from app.services.ml_service import phishing_model
from app.utils.text_utils import analyze_email_text
from app.utils.url_utils import analyze_url


def _dedupe_keep_order(items: list[str]) -> list[str]:
    seen: set[str] = set()
    ordered: list[str] = []
    for item in items:
        if item not in seen:
            ordered.append(item)
            seen.add(item)
    return ordered


def analyze_payload(email_text: str, url: str) -> dict[str, object]:
    text_score, text_reasons, highlights = analyze_email_text(email_text)
    url_score, url_reasons = analyze_url(url)

    base_score = min(100, text_score + url_score)

    ml_probability = phishing_model.predict_probability(email_text)
    combined_score = base_score
    reasons = text_reasons + url_reasons

    if ml_probability is not None:
        ml_score = int(round(ml_probability * 100))
        combined_score = int(round((0.65 * base_score) + (0.35 * ml_score)))
        if ml_probability >= 0.7:
            reasons.append("ML model detected phishing-like language patterns.")
        elif ml_probability <= 0.3:
            reasons.append("ML model observed mostly benign language patterns.")

    if not email_text.strip() and not url.strip():
        reasons.append("No email text or URL was provided for analysis.")

    combined_score = max(0, min(100, combined_score))
    result = "Phishing" if combined_score >= 50 else "Safe"

    return {
        "result": result,
        "risk_score": combined_score,
        "reasons": _dedupe_keep_order(reasons),
        "highlight_words": _dedupe_keep_order(highlights),
    }
