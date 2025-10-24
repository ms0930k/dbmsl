import cron from "node-cron";
import { fetchAndScheduleNews } from "../services/newsService";

cron.schedule("0 6 * * *", async () => {
  console.log("🔄 Running daily scheduled news fetch...");
  try {
    await fetchAndScheduleNews();
    console.log("✅ Daily news fetch + scheduling completed.");
  } catch (err) {
    console.error("❌ Error in daily cron job:", err);
  }
});

// cron.schedule("* * * * *",async () => {
//   console.log("Checking and sending scheduled news...");
//   try{
//     await sendScheduledNews();
//   }
//   catch(err){
//       console.error("❌ Error in scheduled news sending:", err);    
//   }
// });