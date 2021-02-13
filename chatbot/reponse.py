import re
import bs4
import requests
import difflib

def data_filtering(filename):
    string = []    
    with open(filename, "r") as f:
        full_text = f.read()
        for l in re.split(r"(?<=[.!?])", full_text):
            if l != ".":
                string.append(l + "\n")
    return string

def basicReply(input_text):
    replyCode = 0
    text = ''
    if input_text in ['hey','hello','hi','Hey','Hello','Hi']:
        text = 'Hey!'
        replyCode = 1
    elif input_text in ['Help','help','who are you?','Who are you?','who are you','Who are you?']:
        text = "Hey, Im your teacher assistant! I have all answers to any questions you may have seen in a quiz. Ask me a previous question?"
        replyCode = 1
    elif input_text in ['How are you?', 'how are you?','how are you','How are you']:
        text = "Im great? How are you? How can I help?"
        replyCode = 1
    elif input_text in ['/start']:
        text = "Hey, Im Teacher Assistant. How may I help you?"
        replyCode = 1
    return replyCode, text

def text(input_text, summary):
    reply = difflib.get_close_matches(input_text, summary)
    if len(reply)==0:
        reply_text = 'Thank you for that question. I can not find the answer within my database. Please try another? Maybe a question from a previous quiz?'
    else:
        reply_text = reply
    return reply_text

def returnReply(user_reponse, summaryfile):
    code, basic_text = basicReply(user_reponse)
    if code == 1:
        return basic_text
    else:
        summary = data_filtering(summaryfile)    
        reply_text = text(user_reponse, summary)
        return reply_text