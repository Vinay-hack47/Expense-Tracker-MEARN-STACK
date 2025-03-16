import express, { urlencoded } from "express";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./router/user.route.js"
import expenseRouter from "./router/expense.route.js"



//set up env file
dotenv.config({});

const app = express();
connectDB();

const PORT = 8000;

app.get("/" , (req,res) =>{
  res.send("Hello World");
})

//set up middleware
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
}
app.use(cors(corsOptions));

//api's
app.use("/api/v1/user", userRouter);
app.use("/api/v1/expense", expenseRouter);


app.listen(PORT, () =>{
  console.log(`Server is running on port ${PORT}`);
})