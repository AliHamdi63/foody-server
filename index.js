import express from 'express'; // import express package
import mongoose from 'mongoose'; // import mongoose package
import morgan from 'morgan'; // import morgan package
import cors from 'cors'; // import morgan package
import dotenv from 'dotenv'; // import morgan package
import uploadRouter from './routes/upload.js';

dotenv.config(); //to make env File to save sensitive data

const PORT = process.env.PORT || 5000 ;
const MONGOOSEDB = process.env.MONGOOSE_DB_CONNECTION;
const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static('public'));

//this endPoint is used to upload image to public/images folder
app.use('/upload',uploadRouter);

//connect to mongoose database
mongoose.connect(MONGOOSEDB,(err)=>{
    !err? console.log(`connected to mongoDB successfully`): console.log(err.message);
})

//connect to server
app.listen(PORT,(err)=>{
    !err? console.log(`server is running on port ${PORT}`): console.log(err.message);
})

