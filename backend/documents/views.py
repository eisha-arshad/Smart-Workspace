# views.py
from rest_framework import viewsets, permissions
from .models import Document, categorize, generate_summary
from .serializers import DocumentSerializer
import openai
from django.conf import settings

openai.api_key = settings.OPENAI_API_KEY

class DocumentViewSet(viewsets.ModelViewSet):
                            # pylint: disable=no-member

    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
                                # pylint: disable=no-member

        queryset = Document.objects.filter(user=self.request.user)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(title__icontains=search)
        return queryset

    def perform_create(self, serializer):
        """Save document and generate AI summary immediately"""
        document = serializer.save(user=self.request.user)

        # 1. Local AI logic (categorize & short summary)
        category = categorize(document.text)
        short_summary = generate_summary(document.text)

        # 2. Optional: OpenAI 3-5 sentence summary
        try:
            if document.text.strip():  # only if text exists
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": f"Summarize this document in 3-5 sentences:\n{document.text}"}
                    ],
                    temperature=0.5,
                    max_tokens=200
                )
                ai_summary = response.choices[0].message.content.strip()
            else:
                ai_summary = short_summary
        except Exception as e:
            print("OpenAI summary generation failed:", e)
            ai_summary = short_summary

        # 3. Update the document with AI summary and category
        document.category = category
        document.ai_summary = ai_summary
        document.save()