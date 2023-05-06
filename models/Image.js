import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({}, { strict: false });

export default mongoose.models?.Image || mongoose.model("Image", ImageSchema);