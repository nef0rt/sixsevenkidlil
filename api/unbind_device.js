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
    
    const { telegram_id } = req.body;
    
    if (!telegram_id) {
        return res.status(400).json({ error: 'telegram_id required' });
    }
    
    const key = userKeys.get(telegram_id);
    
    if (!key) {
        return res.status(404).json({ error: 'No key found' });
    }
    
    const keyData = keys.get(key);
    
    if (keyData) {
        // Если было привязано устройство, удаляем привязку
        if (keyData.deviceId) {
            deviceBindings.delete(keyData.deviceId);
        }
        keyData.used = false;
        keyData.deviceId = null;
        keys.set(key, keyData);
    }
    
    res.status(200).json({ success: true });
                                     }
