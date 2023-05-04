// Import mongoose
const mongoose = require("mongoose");

// Get the mongodb URI from the environment variable
const MONGODB_URI=process.env.DB_URI;

// If no URI provided, throw an error
if(!MONGODB_URI) {
    throw new Error("Please define the DB_URI environment variable");
}

// Cache mongoose
let cached = global.mongoose;

// If there is no cache, create one
if(!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

// Create the connect function
module.exports = async() => {
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