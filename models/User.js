import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({}, { strict: false });

export default mongoose.models.User || mongoose.model("User", UserSchema);