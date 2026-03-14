// Хранилище в памяти (живёт пока сервер не перезапустят)
const keys = new Map();          // key -> { telegramId, createdAt, expiresAt, used }
const userKeys = new Map();      // telegramId -> key

export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
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

  // Проверяем, есть ли уже ключ у этого пользователя
  const existingKey = userKeys.get(telegram_id);
  if (existingKey) {
    const keyData = keys.get(existingKey);
    if (keyData && !keyData.used && keyData.expiresAt > Date.now()) {
      return res.status(200).json({ key: existingKey });
    }
  }

  // Генерируем новый ключ (16 символов)
  const key = Math.random().toString(36).substring(2, 10) + 
              Math.random().toString(36).substring(2, 10);

  const keyData = {
    telegramId: telegram_id,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 дней
    used: false
  };

  // Сохраняем
  keys.set(key, keyData);
  userKeys.set(telegram_id, key);

  res.status(200).json({ key });
}
