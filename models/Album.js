import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema({}, { strict: false });

export default mongoose.models?.Album || mongoose.model("Album", AlbumSchema);