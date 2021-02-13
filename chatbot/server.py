from bot import telegram_chatbot
import reponse

bot = telegram_chatbot("config.cfg")

summaryfile = 'demo.txt'

def make_reply(msg,summaryfile):
    reply = None
    if msg is not None:
        reply = reponse.returnReply(msg, summaryfile)
    return reply

update_id = None
while True:
    updates = bot.get_updates(offset=update_id)
    updates = updates["result"]
    if updates:
        for item in updates:
            update_id = item["update_id"]
            try:
                message = str(item["message"]["text"])
            except:
                message = None
            from_ = item["message"]["from"]["id"]
            reply = make_reply(message, summaryfile)
            bot.send_message(reply, from_)
