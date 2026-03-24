from __future__ import annotations

from dataclasses import dataclass


@dataclass
class MLArtifacts:
    model: object | None
    vectorizer: object | None


class OptionalPhishingModel:
    def __init__(self) -> None:
        self.artifacts = MLArtifacts(model=None, vectorizer=None)
        self.enabled = False
        self._train_if_available()

    def _train_if_available(self) -> None:
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.linear_model import LogisticRegression
        except ImportError:
            self.enabled = False
            return

        phishing_samples = [
            "urgent verify your account immediately click now",
            "your bank account is locked confirm your password",
            "otp required now click link to avoid suspension",
            "security alert update payment details now",
            "final warning your profile will be deleted",
            "claim your prize by sharing bank credentials",
            "confirm login attempt with otp now",
            "password expired reset with this secure form",
            "account suspended verify immediately",
            "paypa1 security update click now",
        ]

        safe_samples = [
            "team meeting moved to 4 pm please review agenda",
            "your electricity bill is available in the portal",
            "welcome to our newsletter thanks for subscribing",
            "project update attached for weekly review",
            "invoice paid successfully no action required",
            "system maintenance planned this weekend",
            "thanks for your application we will contact soon",
            "security newsletter best practices for strong passwords",
            "new policy document has been published",
            "your package has shipped and will arrive tomorrow",
        ]

        train_x = phishing_samples + safe_samples
        train_y = [1] * len(phishing_samples) + [0] * len(safe_samples)

        vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
        features = vectorizer.fit_transform(train_x)

        model = LogisticRegression(max_iter=500)
        model.fit(features, train_y)

        self.artifacts = MLArtifacts(model=model, vectorizer=vectorizer)
        self.enabled = True

    def predict_probability(self, text: str) -> float | None:
        if not self.enabled or not text.strip():
            return None

        vectorizer = self.artifacts.vectorizer
        model = self.artifacts.model
        if vectorizer is None or model is None:
            return None

        features = vectorizer.transform([text])
        probability = model.predict_proba(features)[0][1]
        return float(probability)


phishing_model = OptionalPhishingModel()
