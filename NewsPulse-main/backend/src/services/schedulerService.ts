import cron from "node-cron";
import NewsScheduler from "../models/NewsScheduler";
import { sendTelegramMessage } from "./telegramService";
import { sendEmail, NewsItem } from "./mailService";
import { escapeTelegramMarkdown } from "../controllers/telegramHelper";
import { enhanceNewsArticle } from "./geminiService"; // Gemini integration

interface EmailGroup {
  user: any;
  summaries: any[];
}

// Run every minute
cron.schedule("* * * * *", async () => {
  console.log("🔄 Checking for due schedules...");

  try {
    const dueSchedules = await NewsScheduler.find({
      send_time: { $lte: new Date() },
      status: false,
    }).populate("user_id summary_id");

    const emailGroups: Record<string, EmailGroup> = {};

    for (const sched of dueSchedules) {
      const summary = sched.summary_id as any;
      const user = sched.user_id as any;

      if (!summary || !user) {
        console.warn(`⚠️ Missing reference for schedule ${sched._id}`);
        continue;
      }

      // Generate enhanced title & summary using Gemini
      const { enhancedTitle, enhancedSummary } = await enhanceNewsArticle({
        title: summary.title || "",
        summary_text: summary.summary_text,
      });

      const uid = user._id?.toString() ?? user.email ?? user.telegram_id;
      if (!uid) continue;

      // Telegram (send one-by-one)
      if (sched.send_method?.includes("telegram") && user.telegram_id) {
        try {
          const message = `📰 ${escapeTelegramMarkdown(
            enhancedTitle
          )}\n\n${escapeTelegramMarkdown(enhancedSummary)}\n\n🔗 ${
            summary.source_url
          }`;
          await sendTelegramMessage(user.telegram_id, message);
        } catch (e) {
          console.error("❌ Telegram send failed:", e);
        }
      }

      // Email (group for digest)
      if (sched.send_method?.includes("email") && user.email) {
        if (!emailGroups[uid]) {
          emailGroups[uid] = { user, summaries: [] };
        }
        emailGroups[uid].summaries.push({
          title: enhancedTitle,
          summary_text: enhancedSummary,
          source_url: summary.source_url,
          image_url: summary.image_url || "",
        });
      }

      // Mark schedule as sent
      sched.status = true;
      await sched.save();
    }

    // Send grouped emails
    for (const group of Object.values(emailGroups)) {
      const { user, summaries } = group;
      if (!summaries?.length) continue;

      const newsItems: NewsItem[] = summaries.map((s) => ({
        title: s.title,
        summary: s.summary_text,
        url: s.source_url,
        imageUrl: s.image_url,
      }));

      try {
        await sendEmail(
          user.email,
          "📰 Your Daily News93 Digest",
          newsItems
        );
      } catch (e) {
        console.error("❌ Email send failed for", user.email, e);
      }
    }
  } catch (err) {
    console.error("❌ Scheduler job error:", err);
  }
});


