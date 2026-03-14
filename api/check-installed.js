import { installations } from './install-modules.js';
import { keys, userKeys } from './generate-key.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { telegram_id } = req.query;
  if (!telegram_id) {
    return res.status(400).json({ error: 'telegram_id required' });
  }

  // Проверяем, активирован ли ключ
  const userKey = userKeys.get(telegram_id);
  const keyData = userKey ? keys.get(userKey) : null;
  
  if (!keyData || !keyData.used) {
    return res.status(200).json({ 
      installed: false,
      keyActivated: false
    });
  }

  // Проверяем статус установки
  const installData = installations.get(telegram_id);

  res.status(200).json({ 
    installed: installData?.installed || false,
    keyActivated: true,
    installData: installData || null
  });
}
