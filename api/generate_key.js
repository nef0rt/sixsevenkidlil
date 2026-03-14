import { keys, userKeys } from '../lib/store.js';

// Секретный ключ для проверки бота (только ты знаешь)
const BOT_SECRET = "FraZzerNFT_bot_secret_2026";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { telegram_id, bot_secret } = req.body;
    
    // КРИТИЧЕСКИ ВАЖНО: проверяем, что запрос от настоящего бота
    if (!bot_secret || bot_secret !== BOT_SECRET) {
        console.log(`❌ Попытка несанкционированного доступа к генерации ключей`);
        return res.status(403).json({ 
            error: 'Access denied. Only @FraZzerNFTbot can generate keys.',
            bot: '@FraZzerNFTbot' 
        });
    }
    
    if (!telegram_id) {
        return res.status(400).json({ error: 'telegram_id required' });
    }

    // Проверяем, есть ли уже ключ у пользователя
    const existingKey = userKeys.get(telegram_id);
    if (existingKey) {
        const keyData = keys.get(existingKey);
        if (keyData && !keyData.used) {
            // Возвращаем существующий ключ
            return res.status(200).json({ 
                key: existingKey,
                message: 'У вас уже есть активный ключ'
            });
        }
    }

    // Генерируем новый ключ (16 символов)
    const key = Math.random().toString(36).substring(2, 10) + 
                Math.random().toString(36).substring(2, 10);
    
    const keyData = {
        telegramId: telegram_id,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 дней
        used: false,
        deviceId: null
    };
    
    // Сохраняем в хранилище сайта
    keys.set(key, keyData);
    userKeys.set(telegram_id, key);
    
    console.log(`✅ Ключ ${key} создан для Telegram ID: ${telegram_id} через @FraZzerNFTbot`);
    
    res.status(200).json({ 
        key: key,
        message: 'Ключ успешно создан'
    });
        }
