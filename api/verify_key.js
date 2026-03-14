import { keys, userKeys } from '../lib/store.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { key, telegram_id, device_id } = req.body;
    
    if (!key || !telegram_id) {
        return res.status(400).json({ error: 'key and telegram_id required' });
    }

    console.log(`🔍 Сайт проверяет ключ ${key} для ${telegram_id}`);

    // Ищем ключ в хранилище сайта
    const keyData = keys.get(key);
    
    if (!keyData) {
        return res.status(200).json({ 
            valid: false, 
            message: 'Неверный ключ! Получите в боте @FraZzerNFTbot' 
        });
    }

    // Проверяем статус ключа
    if (keyData.used) {
        return res.status(200).json({ 
            valid: false, 
            message: 'Ключ уже использован!' 
        });
    }
    
    if (keyData.telegramId !== telegram_id) {
        return res.status(200).json({ 
            valid: false, 
            message: 'Ключ не для этого пользователя!' 
        });
    }
    
    if (keyData.expiresAt < Date.now()) {
        return res.status(200).json({ 
            valid: false, 
            message: 'Ключ истёк!' 
        });
    }
    
    // Активируем ключ
    keyData.used = true;
    if (device_id) keyData.deviceId = device_id;
    keys.set(key, keyData);
    
    console.log(`✅ Сайт активировал ключ ${key} для ${telegram_id}`);
    
    res.status(200).json({ 
        valid: true, 
        message: 'Успешно!'
    });
}
