import { Router } from "express";
import NewsScheduler from "../models/NewsScheduler";

const router = Router();

router.post("/",async(req,res) => {
    try{
        const { user_id, summary_id, send_time, send_method } = req.body;

        const newSchedule = new NewsScheduler({
            user_id,
            summary_id,
            send_time,
            send_method
        });

        await newSchedule.save();
        res.status(201).json(newSchedule);
    }catch (error) {
        res.status(400).json({ error: "Scheduler creation failed", details: error });
    }
});

router.get("/:userId",async(req,res) => {
    try{
        const schedules = await NewsScheduler.find({ user_id: req.params.userId });
        res.json(schedules);
    }
    catch(err){
        res.status(400).json({ error: "Error fetching schedules" });
    }
}); 

export default router;