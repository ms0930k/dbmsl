import { sendTelegramMessage } from "./services/telegramService";

(async () => {
  const chatId = "YOUR_CHAT_ID"; // replace with your own chatId
  await sendTelegramMessage(chatId, "🚀 Test message from NewsPulse backend!");
})();
