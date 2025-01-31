import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel"
import bcrypt from 'bcryptjs';
import zodiacModel from "../models/zodiacModel";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        const userAdmin = await User.findOne({ role: "admin" })
        if (!userAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            const defaultAdmin = new User({
                email: 'admin@yopmail.com',
                name: 'Admin User',
                password: hashedPassword,
                role: 'admin',
                provider: 'local'
            });

            await defaultAdmin.save();
            console.log('Default admin created!')
        }

        // const zodicExit = await zodiacModel.countDocuments();
        // let documents = [
        //     { name: 'aries', zodiac: 1 },
        //     { name: 'taurus', zodiac: 2 },
        //     { name: 'gemini', zodiac: 3 },
        //     { name: 'cancer', zodiac: 4 },
        //     { name: 'leo', zodiac: 5 },
        //     { name: 'virgo', zodiac: 6 },
        //     { name: 'libra', zodiac: 7 },
        //     { name: 'scorpio', zodiac: 8 },
        //     { name: 'sagittarius', zodiac: 9 },
        //     { name: 'capricorn', zodiac: 10 },
        //     { name: 'aquarius', zodiac: 11 },
        //     { name: 'pisces', zodiac: 12 },
        // ]
        // if (zodicExit === 12) {

        //     await zodiacModel.insertMany(documents);
        // } else {
        //     await zodiacModel.deleteMany({});
        //     await zodiacModel.insertMany(documents);
        // }


        console.log("MongoDB connected", process.env.MONGODB_URI);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
export default connectDB;
