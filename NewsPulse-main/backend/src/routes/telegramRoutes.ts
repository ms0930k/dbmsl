import { Router } from "express";
import { sendTestMessage, sendInstantNews } from "../controllers/telegramController";
import User from "../models/User";
import bot from "../services/telegramService";
import { fetchAndScheduleForUser } from "../services/userNewsService";
import { fetchNewsCategory } from "../services/newsApiService";
import { sendTelegramMessage } from "../services/telegramService";
import { escapeTelegramMarkdown } from "../controllers/telegramHelper";

const router = Router();

bot.startPolling();

const categories = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];
const userSelections: Record<number, string[]> = {};
const userSteps: Record<number, string> = {};

// /start handler
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  const user = await User.findOne({ telegram_id: chatId.toString() });

  if (user) {
    // Existing user → management menu
    await bot.sendMessage(
      chatId,
      "👋 Welcome back! What would you like to do?",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📰 Get Instant News",
                callback_data: "instant_news",
              },
            ],
            [
              {
                text: "📂 Change Categories",
                callback_data: "change_categories",
              },
            ],
            [
              {
                text: "⏰ Change Schedule Time",
                callback_data: "change_schedule",
              },
            ],
            [
              {
                text: "📬 Change Delivery Method",
                callback_data: "change_delivery",
              },
            ],
            [{ text: "❌ Unsubscribe", callback_data: "unsubscribe" }],
          ],
        },
      }
    );
  } else {
    // New user → ask for email
    await bot.sendMessage(
      chatId,
      "👋 Welcome to News93! Please enter your email to register:"
    );
    userSteps[chatId] = "awaiting_email";
  }
});

// /news command handler for instant news
bot.onText(/\/news/, async (msg) => {
  const chatId = msg.chat.id;

  const user = await User.findOne({ telegram_id: chatId.toString() });

  if (!user) {
    return bot.sendMessage(
      chatId,
      "⚠️ You need to register first. Please use /start to begin."
    );
  }

  if (!user.category || user.category.length === 0) {
    return bot.sendMessage(
      chatId,
      "⚠️ You haven't selected any news categories yet. Please use /start to configure your preferences."
    );
  }

  // Send loading message
  const loadingMsg = await bot.sendMessage(chatId, "🔄 Fetching latest news for you...");

  try {
    let newsCount = 0;
    const maxNewsPerCategory = 2; // Limit to avoid spam

    for (const category of user.category) {
      try {
        const newsList = await fetchNewsCategory(category);
        const limitedNews = newsList.slice(0, maxNewsPerCategory);

        for (const news of limitedNews) {
          const message = `📰 *${escapeTelegramMarkdown(category.toUpperCase())}*\n\n${escapeTelegramMarkdown(news.title)}\n\n${escapeTelegramMarkdown(news.summary_text)}\n\n🔗 [Read More](${escapeTelegramMarkdown(news.source_url)})`;
          
          await sendTelegramMessage(chatId, message);
          newsCount++;
        }
      } catch (error) {
        console.error(`Error fetching news for category ${category}:`, error);
      }
    }

    // Update loading message with success
    await bot.editMessageText(
      `✅ Found and sent ${newsCount} news articles!`,
      { chat_id: chatId, message_id: loadingMsg.message_id }
    );

  } catch (error) {
    console.error("Error in /news command:", error);
    await bot.editMessageText(
      "❌ Sorry, there was an error fetching news. Please try again later.",
      { chat_id: chatId, message_id: loadingMsg.message_id }
    );
  }
});

// /help command handler
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;

  const helpText = `🤖 *News93 Bot Commands*

/start - Register or manage your account
/news - Get instant news from your selected categories
/help - Show this help message

*Features:*
• 📰 Get personalized news based on your interests
• ⏰ Scheduled daily news delivery
• 🔔 Multiple delivery methods (Telegram, Email, Both)
• 📂 Customizable news categories

*Categories available:*
${categories.map(cat => `• ${cat}`).join('\n')}

Need help? Contact support or use /start to configure your preferences.`;

  await bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

// Handle messages for multi-step registration
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const step = userSteps[chatId];

  if (!msg.text || msg.text.startsWith("/")) return;

  switch (step) {
    case "awaiting_email":
      const email = msg.text.trim();
      const existing = await User.findOne({ email });
      if (existing) {
        return bot.sendMessage(
          chatId,
          "⚠️ This email is already registered. Please enter a different email."
        );
      }
      userSteps[chatId] = "awaiting_password";
      userSelections[chatId] = [email]; // temporarily store email
      return bot.sendMessage(
        chatId,
        "🔑 Please set a password for website login:"
      );

    case "awaiting_password":
      const password = msg.text.trim();
      // Create user now
      if (!userSelections[chatId] || !userSelections[chatId][0]) {
        await bot.sendMessage(
          chatId,
          "⚠️ Registration error. Please restart the process."
        );
        userSteps[chatId] = "";
        delete userSelections[chatId];
        break;
      }
      await User.create({
        email: userSelections[chatId][0],
        username: userSelections[chatId][0],
        password,
        telegram_id: chatId.toString(),
      });
      userSteps[chatId] = "";
      delete userSelections[chatId];
      await askCategories(chatId);
      break;

    case "awaiting_time":
      const time = msg.text.trim();
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(time)) {
        return bot.sendMessage(
          chatId,
          "⚠️ Invalid time format. Please enter in HH:MM (24hr) format."
        );
      }
      await User.findOneAndUpdate(
        { telegram_id: chatId.toString() },
        { preferred_time_of_day: time }
      );
      userSteps[chatId] = "awaiting_delivery";
      bot.sendMessage(chatId, "📬 Choose your delivery method:", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "💬 Telegram", callback_data: "delivery_telegram" }],
            [{ text: "📧 Email", callback_data: "delivery_email" }],
            [{ text: "🔔 Both", callback_data: "delivery_both" }],
          ],
        },
      });
      break;
  }
});

// Category selection
async function askCategories(chatId: number) {
  const keyboard = categories.map((cat) => [
    {
      text: userSelections[chatId]?.includes(cat) ? `✅ ${cat}` : cat,
      callback_data: `toggle_${cat}`,
    },
  ]);
  keyboard.push([{ text: "✅ Done", callback_data: "done_categories" }]);
  await bot.sendMessage(chatId, "📂 Select your preferred categories:", {
    reply_markup: { inline_keyboard: keyboard },
  });
}

// Handle callback queries
bot.on("callback_query", async (query) => {
  const chatId = query.message?.chat.id!;
  const data = query.data || "";

  // Helper function to safely answer callback queries
  const safeAnswerCallback = async (queryId: string, text?: string) => {
    try {
      await bot.answerCallbackQuery(queryId, { text });
    } catch (error: any) {
      console.warn(`⚠️ Failed to answer callback query ${queryId}:`, error.message);
    }
  };

  // Instant news handler
  if (data === "instant_news") {
    const user = await User.findOne({ telegram_id: chatId.toString() });
    
    if (!user) {
      await bot.sendMessage(chatId, "⚠️ You need to register first. Please use /start to begin.");
      return safeAnswerCallback(query.id, "Please register first");
    }

    if (!user.category || user.category.length === 0) {
      await bot.sendMessage(chatId, "⚠️ You haven't selected any news categories yet. Please use /start to configure your preferences.");
      return safeAnswerCallback(query.id, "Configure categories first");
    }

    // Send loading message
    const loadingMsg = await bot.sendMessage(chatId, "🔄 Fetching latest news for you...");

    try {
      let newsCount = 0;
      const maxNewsPerCategory = 2; // Limit to avoid spam

      for (const category of user.category) {
        try {
          const newsList = await fetchNewsCategory(category);
          const limitedNews = newsList.slice(0, maxNewsPerCategory);

          for (const news of limitedNews) {
            const message = `📰 *${escapeTelegramMarkdown(category.toUpperCase())}*\n\n${escapeTelegramMarkdown(news.title)}\n\n${escapeTelegramMarkdown(news.summary_text)}\n\n🔗 [Read More](${escapeTelegramMarkdown(news.source_url)})`;
            
            await sendTelegramMessage(chatId, message);
            newsCount++;
          }
        } catch (error) {
          console.error(`Error fetching news for category ${category}:`, error);
        }
      }

      // Update loading message with success
      await bot.editMessageText(
        `✅ Found and sent ${newsCount} news articles!`,
        { chat_id: chatId, message_id: loadingMsg.message_id }
      );

    } catch (error) {
      console.error("Error in instant news callback:", error);
      await bot.editMessageText(
        "❌ Sorry, there was an error fetching news. Please try again later.",
        { chat_id: chatId, message_id: loadingMsg.message_id }
      );
    }

    return safeAnswerCallback(query.id, "News sent!");
  }

  // Toggle categories
  if (data.startsWith("toggle_")) {
    const category = data.replace("toggle_", "");
    if (!userSelections[chatId]) userSelections[chatId] = [];
    if (userSelections[chatId].includes(category)) {
      userSelections[chatId] = userSelections[chatId].filter(
        (c) => c !== category
      );
    } else {
      userSelections[chatId].push(category);
    }
    await askCategories(chatId);
    return safeAnswerCallback(query.id);
  }

  // Done selecting categories
  if (data === "done_categories") {
    const selected = userSelections[chatId] || [];
    if (selected.length === 0) {
      await bot.sendMessage(chatId, "⚠️ Please select at least one category.");
      return safeAnswerCallback(query.id, "Please select at least one category");
    }
    await User.findOneAndUpdate(
      { telegram_id: chatId.toString() },
      { category: selected }
    );
    delete userSelections[chatId];
    userSteps[chatId] = "awaiting_time";
    await bot.sendMessage(
      chatId,
      "⏰ Now, please enter your preferred time (HH:MM in 24hr):"
    );
    return safeAnswerCallback(query.id);
  }

  // Delivery method selection
  if (data.startsWith("delivery_")) {
    const method = data.replace("delivery_", "");
    const user = await User.findOneAndUpdate(
      { telegram_id: chatId.toString() },
      { delivery_method: method },
      { new: true}
    );

    if(user){
      await fetchAndScheduleForUser(user);
    }

    userSteps[chatId] = "";
    await bot.sendMessage(
      chatId,
      `✅ Registration complete!\nYour delivery method: ${method}`
    );
    return safeAnswerCallback(query.id);
  }

  // Existing user options
  if (data === "change_categories") {
    await askCategories(chatId);
    return safeAnswerCallback(query.id);
  }
  if (data === "change_schedule") {
    await bot.sendMessage(
      chatId,
      "⏰ Please enter your preferred time (HH:MM in 24hr):"
    );
    userSteps[chatId] = "awaiting_time";
    return safeAnswerCallback(query.id);
  }
  if (data === "change_delivery") {
    await bot.sendMessage(chatId, "📬 Choose your delivery method:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "💬 Telegram", callback_data: "delivery_telegram" }],
          [{ text: "📧 Email", callback_data: "delivery_email" }],
          [{ text: "🔔 Both", callback_data: "delivery_both" }],
        ],
      },
    });
    return safeAnswerCallback(query.id);
  }
  if (data === "unsubscribe") {
    await User.findOneAndUpdate(
      { telegram_id: chatId.toString() },
      { subscription_status: false }
    );
    await bot.sendMessage(chatId, "❌ You have been unsubscribed from News93.");
    return safeAnswerCallback(query.id);
  }
});

router.post("/test", sendTestMessage);
router.post("/instant-news", sendInstantNews);

export default router;
