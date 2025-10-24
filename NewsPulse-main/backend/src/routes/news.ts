import { Router } from "express";
import NewsSummary from "../models/NewsSummary";
import NewsScheduler from "../models/NewsScheduler";
import { fetchAndScheduleNews } from "../services/newsService";

const router = Router();

router.post("/summary",async(req,res) => {
    try{
        const schedule = new NewsSummary(req.body);
        await schedule.save();
        res.status(201).json(schedule);
    }
    catch(err){
        res.status(400).json({ error: "Scheduler creation failed", details: err });
    }
});

router.post("/schedule", async (req, res) => {
  try {
    const schedule = new NewsScheduler(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ error: "Scheduler creation failed", details: err });
  }
});

router.get("/schedule", async (req, res) => {
  const schedules = await NewsScheduler.find()
    .populate("user_id")
    .populate("summary_id");
  res.json(schedules);
});


// Testing endpoint for checking fetching news or not
router.post("/fetch", async (req, res) => {
  try {
    await fetchAndScheduleNews();
    res.json({ message: "✅ News fetched and scheduled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to fetch and schedule news" });
  }
});


router.post("/fetch/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await fetchAndScheduleNews(userId);
    res.json({ message: `✅ News fetched for user ${userId}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to fetch news for user" });
  }
});

export default router;