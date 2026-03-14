// Хранилище установок
const installations = new Map();      // telegramId -> { installed: bool, lastInstall: timestamp }
const cooldowns = new Map();          // telegramId -> timestamp

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { telegram_id } = req.body;
  if (!telegram_id) {
    return res.status(400).json({ error: 'telegram_id required' });
  }

  // Проверяем кулдаун (30 секунд)
  const lastInstall = cooldowns.get(telegram_id);
  if (lastInstall && Date.now() - lastInstall < 30000) {
    return res.status(429).json({ 
      error: 'cooldown', 
      message: 'Подождите 30 секунд',
      remaining: 30000 - (Date.now() - lastInstall)
    });
  }

  // Генерируем случайное время установки (2-10 минут)
  const installTime = Math.floor(Math.random() * (10 * 60 - 2 * 60 + 1) + 2 * 60) * 1000;

  // Сохраняем информацию об установке
  installations.set(telegram_id, {
    installed: true,
    installStart: Date.now(),
    installDuration: installTime,
    completeTime: Date.now() + installTime
  });

  // Запоминаем время для кулдауна
  cooldowns.set(telegram_id, Date.now());

  res.status(200).json({ 
    success: true, 
    installTime,
    message: 'Установка началась'
  });
}
