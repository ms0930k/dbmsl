import axios from "axios";
import NewsSummary from "../models/NewsSummary";
import NewsScheduler from "../models/NewsScheduler";
import User from "../models/User";
import dotenv from "dotenv";


dotenv.config();

const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";

const categoryMap: Record<string, string> = {
  technology: "technology",
  business: "business",
  sports: "sports",
  health: "health",
  entertainment: "entertainment",
  science: "science",
  world: "general",
};

export async function fetchNewsCategory(category: string) {
  const apiCategory = categoryMap[category.toLowerCase()] || "general";
  console.log("Fetching category:", apiCategory);

  try {
    const res = await axios.get(NEWS_API_URL, {
      params: {
        category: apiCategory,
        apiKey: process.env.NEWS_API_KEY,
        language: "en",
        pageSize: 5,
      },
    });

    return res.data.articles.map((article: any) => ({
      summary_text: article.description || article.title,
      category: apiCategory, 
      source_url: article.url,
      image_url: article.urlToImage || "",
    }));
  } catch (err) {
    console.error("❌ News API error:", err);
    return [];
  }
}