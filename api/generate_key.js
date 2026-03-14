import { keys, userKeys } from '../lib/store.js';

// Твой токен для проверки
const BOT_TOKEN = "8255755052:AAFjHxgUKDccQVi33kWGuUXkARcR85CxXDQ";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { telegram_id, bot_token } = req.body;
    
    // Проверяем что запрос от настоящего бота
    if (bot_token !== BOT_TOKEN) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    if (!telegram_id) return res.status(400).json({ error: 'telegram_id required' });

    // Проверяем есть ли уже ключ
    const existingKey = userKeys.get(telegram_id);
    if (existingKey) {
        const keyData = keys.get(existingKey);
        if (keyData && !keyData.used) {
            return res.status(200).json({ key: existingKey });
        }
    }

    // Генерируем новый ключ
    const key = Math.random().toString(36).substring(2, 10) + 
                Math.random().toString(36).substring(2, 10);
    
    keys.set(key, {
        telegramId: telegram_id,
        createdAt: Date.now(),
        used: false
    });
    userKeys.set(telegram_id, key);
    
    res.status(200).json({ key });
}
