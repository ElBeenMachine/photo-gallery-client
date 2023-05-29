import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({}, { strict: false });

export default mongoose.models?.Group || mongoose.model("Group", GroupSchema);