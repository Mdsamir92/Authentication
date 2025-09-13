import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import router from './routes/routes.js';
import cors from 'cors';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/api/auth", router)


const port = 5000;

connectDb();

app.get('/', (req, res) => {
    res.send('Hello,samir!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
