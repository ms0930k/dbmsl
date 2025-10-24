import express from "express";
import connectDB from "./db";
import news from "./routes/news";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes"
import scheduleRoutes from "./routes/schedulerRoutes";
import telegramRoutes from "./routes/telegramRoutes";
import "./services/schedulerService";
import "./services/newsSchedularService";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/news", news);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/telegram", telegramRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});