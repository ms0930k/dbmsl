import { Router } from "express";
import { fetchAndScheduleForUser } from "../services/userNewsService"; // 👈 add this
import User from "../models/User";

const router = Router();

router.post("/register",async(req,res) => {
    try{
        const user = new User(req.body);
        await user.save();

        await fetchAndScheduleForUser(user);

        res.status(201).json(user);
    }
    catch(err){
        res.status(400).json({
            error: "User creation failed", details: err
        });
    }
});

router.get('/',async(req,res) => {
    const users = await User.find();
    res.json(users);
});

export default router;