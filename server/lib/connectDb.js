import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        const res = await mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDb Connected ' + res.connection.name);
    } catch (error) {
        console.log("Error :" + error.message);
        process.exit(1)
    }
}