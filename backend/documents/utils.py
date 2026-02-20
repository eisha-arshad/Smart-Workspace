def categorize_text(text):
    text = text.lower()

    if any(word in text for word in ['code', 'ai', 'software']):
        return 'Technical'
    elif any(word in text for word in ['invoice', 'budget', 'profit']):
        return 'Financial'
    else:
        return 'Personal'


def generate_summary(text):
    sentences = text.split('.')
    return sentences[0][:120] + '...' if sentences else ''
