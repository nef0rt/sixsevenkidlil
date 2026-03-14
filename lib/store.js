// Хранилище в памяти (на Vercel живет пока функция активна)
const keys = new Map();          // key -> { telegramId, createdAt, used, deviceId }
const userKeys = new Map();      // telegramId -> key
const deviceBindings = new Map(); // deviceId -> key

export { keys, userKeys, deviceBindings };
