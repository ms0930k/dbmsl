import mongoose,{Schema,Document} from "mongoose";

export interface INewsSummary extends Document {
    summary_text: string;
    category: string;
    source_url: string;
    image_url?: string
}

const NewsSummarySchema: Schema = new Schema({
    summary_text: { type: String, required: true },
    category: { type: String},
    source_url: { type: String},
    image_url: { type: String}
});

export default mongoose.model<INewsSummary>("NewsSummary",NewsSummarySchema);