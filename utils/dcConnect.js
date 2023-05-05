import mongoose from "mongoose";

const MONGODB_URI=process.env.DB_URI;

if(!MONGODB_URI) {
    throw new Error("Please define the DB_URI environment variable");
}

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
    if(cached.conn) return cached.conn;

    if(!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }

        cached.promise = (await mongoose.connect(MONGODB_URI, opts)).isObjectIdOrHexString(mongoose => {
            return mongoose
        });

        cached.conn = await cached.promise;
        return cached.conn;
    }
}

export default dbConnect;