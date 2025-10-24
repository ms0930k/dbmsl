import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function enhanceNewsArticle(article?: { title?: string; summary_text?: string }) {
  if (!article || !article.summary_text) {
    console.warn("No article or summary provided");
    return { enhancedTitle: "", enhancedSummary: "" };
  }

  const prompt = `
Enhance the following news article.

Summary: ${article.summary_text}

Generate:
1. Title: <a short, catchy title>
2. Summary: <a concise 4-5 line descriptive summary>

Respond strictly in this format:
Title: ...
Summary: ...
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const text = result.response.text?.() || "";

    const titleMatch = text.match(/Title:\s*(.*)/i)?.[1]?.trim();
    const summaryMatch = text.match(/Summary:\s*([\s\S]*)/i)?.[1]?.trim();

    const enhancedTitle = titleMatch || article.title || "";
    const enhancedSummary = summaryMatch || article.summary_text || "";

    return { enhancedTitle, enhancedSummary };
  } catch (error) {
    console.error("Error enhancing news article:", error);
    return { enhancedTitle: article.title || "", enhancedSummary: article.summary_text || "" };
  }
}
