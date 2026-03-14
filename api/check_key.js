import { keys, userKeys } from '../lib/store.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { telegram_id } = req.query;
    
    if (!telegram_id) {
        return res.status(400).json({ error: 'telegram_id required' });
    }
    
    const key = userKeys.get(telegram_id);
    
    if (!key) {
        return res.status(200).json({ 
            hasKey: false 
        });
    }
    
    const keyData = keys.get(key);
    
    res.status(200).json({ 
        hasKey: true,
        key: key,
        activated: keyData?.used || false,
        expiresAt: keyData?.expiresAt || null
    });
}
