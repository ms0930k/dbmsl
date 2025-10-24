import User from "../models/User";
import NewsSummary from "../models/NewsSummary";
import NewsScheduler from "../models/NewsScheduler";
import { fetchNewsCategory } from "./newsApiService";
import { IUser } from "../models/User";

/**
 * Fetch news for all categories a user selected
 * and schedule them for preferred time.
 */
export async function fetchAndScheduleForUser(user: any) {
  try {
    const [hour, minute] = (user.preferred_time_of_day || "09:00")
      .split(":")
      .map(Number);

    for (const cat of user.category) {
      const newsList = await fetchNewsCategory(cat);

      for (const news of newsList) {
        let summary = await NewsSummary.findOne({
          summary_text: news.summary_text,
        });
        if (!summary) {
          summary = await NewsSummary.create(news);
        }

        let sendTime = new Date();
        sendTime.setHours(hour ?? 9, minute ?? 0, 0, 0);

        await NewsScheduler.create({
          user_id: user._id,
          summary_id: summary._id,
          send_time: sendTime,
          send_method:
            user.delivery_method === "both"
              ? ["telegram", "email"]
              : Array.isArray(user.delivery_method)
              ? user.delivery_method
              : [user.delivery_method],
        });
      }
    }

    console.log(`✅ News scheduled for user ${user.email} (${user._id})`);
  } catch (err) {
    console.error("❌ Error scheduling news for user:", err);
  }
}
