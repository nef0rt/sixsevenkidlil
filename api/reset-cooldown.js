import { cooldowns } from './install-modules.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { telegram_id } = req.body;
  if (telegram_id) {
    cooldowns.delete(telegram_id);
  }
  
  res.status(200).json({ success: true });
}
