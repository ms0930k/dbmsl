import { Request,Response } from "express";
import { sendTelegramMessage } from "../services/telegramService";
import { escapeTelegramMarkdown } from "./telegramHelper";
import User from "../models/User";
import NewsSummary from "../models/NewsSummary";
import { fetchNewsCategory } from "../services/newsApiService";

export const sendTestMessage = async (req: Request, res: Response) => {
    try{
        const { userId, summaryId } = req.body;

        if(!userId || !summaryId){
            return res.status(400).json({
                error: "userId and summaryId are required"
            });
        }

        const user = await User.findById(userId);
        const summary = await NewsSummary.findById(summaryId);

        if (!user) return res.status(404).json({ error: "User not found" });
        if (!summary) return res.status(404).json({ error: "Summary not found" });
        if (!user.telegram_id) return res.status(400).json({ error: "User has no Telegram ID" });

        // Build message
        const message = `📰 *${escapeTelegramMarkdown(summary.category)}*\n\n${escapeTelegramMarkdown(summary.summary_text)}\n\n[Read More](${escapeTelegramMarkdown(summary.source_url)})`;

        await sendTelegramMessage(user.telegram_id, message);

        res.json({
            success: true,
            sentTo: user.username || user.email,
            chatId: user.telegram_id,
            summary: summary.summary_text,
        });
    }
    catch(err: any){
        console.error("❌ Error sending test message:", err.message);
        res.status(500).json({ error: "Failed to send message", details: err.message });
    }
}

export const sendInstantNews = async (req: Request, res: Response) => {
    try {
        const { userId, categories } = req.body;

        if (!userId) {
            return res.status(400).json({
                error: "userId is required"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.telegram_id) {
            return res.status(400).json({ error: "User has no Telegram ID" });
        }

        // Use provided categories or user's default categories
        const newsCategories = categories || user.category;
        
        if (!newsCategories || newsCategories.length === 0) {
            return res.status(400).json({ 
                error: "No categories specified. Please configure user categories first." 
            });
        }

        let newsCount = 0;
        const maxNewsPerCategory = 3; // Limit to avoid spam
        const sentNews: any[] = [];

        // Send loading message
        await sendTelegramMessage(user.telegram_id, "🔄 Fetching latest news for you...");

        for (const category of newsCategories) {
            try {
                const newsList = await fetchNewsCategory(category);
                const limitedNews = newsList.slice(0, maxNewsPerCategory);

                for (const news of limitedNews) {
                    const message = `📰 *${escapeTelegramMarkdown(category.toUpperCase())}*\n\n${escapeTelegramMarkdown(news.title)}\n\n${escapeTelegramMarkdown(news.summary_text)}\n\n🔗 [Read More](${escapeTelegramMarkdown(news.source_url)})`;
                    
                    await sendTelegramMessage(user.telegram_id, message);
                    newsCount++;
                    sentNews.push({
                        title: news.title,
                        category: category,
                        source_url: news.source_url
                    });
                }
            } catch (error) {
                console.error(`Error fetching news for category ${category}:`, error);
            }
        }

        // Send completion message
        await sendTelegramMessage(user.telegram_id, `✅ Found and sent ${newsCount} news articles!`);

        res.json({
            success: true,
            sentTo: user.username || user.email,
            chatId: user.telegram_id,
            newsCount: newsCount,
            categories: newsCategories,
            sentNews: sentNews
        });

    } catch (err: any) {
        console.error("❌ Error sending instant news:", err.message);
        res.status(500).json({ error: "Failed to send instant news", details: err.message });
    }
}