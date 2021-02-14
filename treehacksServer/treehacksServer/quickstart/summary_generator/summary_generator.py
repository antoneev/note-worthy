import requests


def summarize_deep_ai(transcript):
    r = requests.post(
        "https://api.deepai.org/api/summarization",
        data={'text': transcript},
        headers={'api-key': '6796eb86-a329-4502-9673-4a207c70ed3a'}
    )
    data = r.json()
    return data.get('output', '')
