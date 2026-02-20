# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Document, categorize, generate_summary

@receiver(post_save, sender=Document)
def apply_ai_logic(sender, instance, created, **kwargs):
    """Apply AI category and summary after a new Document is created."""
    if created:
                        # pylint: disable=no-member

        Document.objects.filter(id=instance.id).update(
            category=categorize(instance.text),       # <-- changed from raw_text
            ai_summary=generate_summary(instance.text)  # <-- changed from raw_text
        )