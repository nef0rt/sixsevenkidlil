import telebot
import requests

TOKEN = "8255755052:AAFjHxgUKDccQVi33kWGuUXkARcR85CxXDQ"
API_URL = "https://sixsevenkidlil.vercel.app/api"  # ЗАМЕНИ НА СВОЙ URL

bot = telebot.TeleBot(TOKEN)

def format_key(key):
    if len(key) >= 12:
        return f"ZENIN-{key[:4]}-{key[4:8]}-{key[8:12]}"
    return key

@bot.message_handler(commands=['start'])
def start(message):
    user_id = message.from_user.id
    
    try:
        response = requests.post(f"{API_URL}/generate-key", json={
            "telegram_id": str(user_id),
            "bot_token": TOKEN
        }, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            formatted_key = format_key(data['key'])
            bot.reply_to(message, 
                f"Спасибо за использование Zenin\n"
                f"Ваш ключ: {formatted_key}\n"
                f"Удачного использования!\n\n"
                f"Введите /del чтоб отвязать устройство от ключа"
            )
        else:
            bot.reply_to(message, "❌ Ошибка при генерации ключа")
    except Exception as e:
        print(f"Error: {e}")
        bot.reply_to(message, "❌ Ошибка соединения с сервером")

@bot.message_handler(commands=['del'])
def delete_key(message):
    bot.reply_to(message, "✅ Устройство отвязано от ключа")

print("✅ Бот @FraZzerNFTbot запущен")
bot.infinity_polling()
