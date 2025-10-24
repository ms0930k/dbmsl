import mongoose,{Schema,Document} from "mongoose";

export interface IUser extends Document {

    email: string;
    telegram_id: string;
    username: string;
    password: string;
    category: string[];
    subscription_status: boolean;
    subscription_date: Date;
    last_news_sent_date: Date;
    preferred_language: string;
    preferred_time_of_day: string;
    delivery_method: string;
}

const userSchema: Schema = new Schema ({
    email: { type: String, required: true, unique: true },
    telegram_id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    category: { type: [String],default: [] },
    subscription_status: { type: Boolean, default: true },
    subscription_date: { type: Date, default: Date.now },
    last_news_sent_date: { type: Date },
    preferred_language: { type: String, default: "en" },
    preferred_time_of_day: { type: String },
    delivery_method: { type: String, enum: ["telegram", "email", "both"], default: "telegram" },

});

export default mongoose.model<IUser>("User",userSchema);