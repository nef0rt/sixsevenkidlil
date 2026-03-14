import { keys, userKeys } from '../lib/store.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { telegram_id, key } = req.body;
    
    if (!telegram_id || !key) {
        return res.status(400).json({ error: 'telegram_id and key required' });
    }
    
    // Проверяем, есть ли уже ключ у этого пользователя
    const existingKey = userKeys.get(telegram_id);
    if (existingKey) {
        const keyData = keys.get(existingKey);
        if (keyData && !keyData.used) {
            return res.status(200).json({ key: existingKey });
        }
    }
    
    // Сохраняем новый ключ
    const keyData = {
        telegramId: telegram_id,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 дней
        used: false,
        deviceId: null
    };
    
    keys.set(key, keyData);
    userKeys.set(telegram_id, key);
    
    res.status(200).json({ key });
}
