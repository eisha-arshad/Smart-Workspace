from django.db import models
from django.conf import settings

class Document(models.Model):
    CATEGORY_CHOICES = [
        ("Technical", "Technical"),
        ("Financial", "Financial"),
        ("Personal", "Personal"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    text = models.TextField()  # The actual document content
    ai_summary = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.title)


# ================= AI Logic =================
def categorize(text: str) -> str:
    """Categorize text into Technical, Financial, or Personal."""
    text = text.lower()
    if any(word in text for word in ['code', 'ai', 'software', 'django', 'react', 'tech']):
        return 'Technical'
    elif any(word in text for word in ['invoice', 'budget', 'profit', 'money', 'finance']):
        return 'Financial'
    return 'Personal'


def generate_summary(text: str) -> str:
    """Generate a simple summary using the first 2 sentences."""
    sentences = text.split('.')
    summary = '. '.join(sentences[:2]).strip()
    if not summary:
        summary = text[:100]
    return summary + "..." if not summary.endswith("...") else summary