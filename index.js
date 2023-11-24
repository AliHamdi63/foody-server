import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


//routes
import uploadRouter from './routes/upload.js';
import mealRouter from './routes/meal.js';
import authRouter from './routes/auth.js';
import orderRouter from './routes/order.js';
import userRouter from './routes/user.js';
import chatRouter from './routes/chat.js';
import messageRouter from './routes/message.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config(); //to make env File to save sensitive data

const PORT = process.env.PORT;
const MONGOOSEDB = process.env.MONGOOSE_DB_CONNECTION;
const app = express();

//connect to mongoose database
mongoose.set('strictQuery', true);
mongoose.connect(MONGOOSEDB, (err) => {
    !err ? console.log(`connected to mongoDB successfully`) : console.log(err.message);
})

app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//EndPoints

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/meals', mealRouter);
app.use('/orders', orderRouter);
app.use('/chats', chatRouter);
app.use('/messages', messageRouter);

//this endPoint is used to upload image to public/images folder
app.use('/upload', uploadRouter);


//connect to server
app.listen(PORT, (err) => {
    !err ? console.log(`server is running on port ${PORT}`) : console.log(err.message);
})

