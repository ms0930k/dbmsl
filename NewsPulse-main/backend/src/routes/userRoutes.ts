import { Router } from "express";
import { fetchAndScheduleForUser } from "../services/userNewsService"; // 👈 add this
import User from "../models/User";

const router = Router();

router.post("/",async(req,res) => {
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

router.post("/login", async(req,res) => {
    try{
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const user = await User.findOne({ email, password });
        
        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        res.json(user);
    }
    catch(err){
        res.status(500).json({
            error: "Login failed", details: err
        });
    }
});

router.get('/',async(req,res) => {
    const users = await User.find();
    res.json(users);
});

export default router;