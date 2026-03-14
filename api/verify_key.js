import { keys, userKeys, deviceBindings } from '../lib/store.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { key, telegram_id, device_id } = req.body;
    
    if (!key || !telegram_id) {
        return res.status(400).json({ error: 'key and telegram_id required' });
    }
    
    // Очищаем ключ от префикса ZENIN- и дефисов
    const cleanKey = key.replace('ZENIN-', '').replace(/-/g, '');
    
    const keyData = keys.get(cleanKey);
    
    if (!keyData) {
        return res.status(404).json({ 
            valid: false, 
            message: 'Неверный ключ! Получите в боте @FraZzerNFTbot' 
        });
    }
    
    if (keyData.used) {
        return res.status(400).json({ 
            valid: false, 
            message: 'Ключ уже использован!' 
        });
    }
    
    if (keyData.telegramId !== telegram_id) {
        return res.status(403).json({ 
            valid: false, 
            message: 'Ключ не для этого пользователя!' 
        });
    }
    
    if (keyData.expiresAt < Date.now()) {
        return res.status(400).json({ 
            valid: false, 
            message: 'Ключ истёк!' 
        });
    }
    
    // Если есть device_id, привязываем устройство
    if (device_id) {
        keyData.deviceId = device_id;
        deviceBindings.set(device_id, cleanKey);
    }
    
    keyData.used = true;
    keyData.activatedAt = Date.now();
    keys.set(cleanKey, keyData);
    
    res.status(200).json({ 
        valid: true, 
        message: 'Успешно!'
    });
}
