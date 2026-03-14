import { keys, userKeys } from './generate-key.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key, telegram_id } = req.body;
  
  if (!key || !telegram_id) {
    return res.status(400).json({ error: 'key and telegram_id required' });
  }

  const keyData = keys.get(key);

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

  // Активируем ключ
  keyData.used = true;
  keyData.activatedAt = Date.now();
  keys.set(key, keyData);

  res.status(200).json({ 
    valid: true, 
    message: 'Успешно!'
  });
}
