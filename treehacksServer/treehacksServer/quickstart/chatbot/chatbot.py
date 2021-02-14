import re
import bs4
import requests
import difflib


class ChatBot(object):
    def _basicReply(self, input_text):
        text = None
        if input_text in ['hey', 'hello', 'hi', 'Hey', 'Hello', 'Hi']:
            text = 'Hey!'
        elif input_text in ['Help', 'help', 'who are you?', 'Who are you?', 'who are you', 'Who are you?']:
            text = "Hey, Im your teacher assistant! I have all answers to any questions you may have seen in a quiz. Ask me a previous question?"
        elif input_text in ['How are you?', 'how are you?', 'how are you', 'How are you']:
            text = "Im great? How are you? How can I help?"
        elif input_text in ['/start']:
            text = "Hey, Im Teacher Assistant. How may I help you?"

        return text

    def _text(self, input_text, questions):
        reply = difflib.get_close_matches(input_text, questions)
        if len(reply) == 0:
            reply_text = ['Thank you for that question. I can not find the answer within my database. Please try another.']
        else:
            reply_text = reply
        return reply_text

    def get_reply(self, user_question, questions):
        basic_text = self._basicReply(user_question)
        if basic_text:
            return [basic_text]

        return self._text(user_question, questions)
