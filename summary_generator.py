import requests

'''
These are the packages required for the second type of summarizer

'''
# !pip install bert-extractive-summarizer
# !pip install spacy==2.1.3
# !pip install transformers==2.2.2
# !pip install neuralcoref
# !python -m spacy download en_core_web_md

def SummarizerDeepAI(path_to_file, file_write_path):
    
    r = requests.post(
    "https://api.deepai.org/api/summarization",
    files={
        'text': open(path_to_file, 'rb'),
    },
    headers={'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K'}
    )
    
    file = open(file_write_path,"w")
    file.write(r.json()['output'])
    file.close()


from summarizer import Summarizer
def BertExtractiveSummarizer(path_to_file, file_write_path, ratio = 0.8,min_length=8, max_length=20):

    file = open(path_to_file,encoding='UTF-8')
    file = file.read()
    model = Summarizer()

    result = model(file, ratio=ratio, min_length=min_length, max_length=max_length)
    output = ''.join(result)


    f = open(file_write_path,"w")
    f.write(output)
    f.close()












