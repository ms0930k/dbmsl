import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

// Support both env var names for flexibility
const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_TOKEN || "";

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error(
    "⚠️ TELEGRAM_BOT_TOKEN or TELEGRAM_TOKEN is missing in .env"
  );
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

export const sendTelegramMessage = async (chatId: string | number, text: string) => {
  try {
    await bot.sendMessage(chatId, text);
    console.log(`✅ Message sent to Telegram user ${chatId}`);
  } catch (err) {
    console.error("❌ Telegram send error:", err);
  }
};

export default bot;