import express, { urlencoded } from "express";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./router/user.route.js";
import expenseRouter from "./router/expense.route.js";
import groupRouter from "./router/group.route.js";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//set up env file
// dotenv.config({});
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = 8000

const app = express();
connectDB();



// app.get("/" , (req,res) =>{
//   res.send("Hello World");
// })

// const _dirname = path.resolve()

//set up middleware
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
  origin: ["http://localhost:5173","https://expense-tracker-mearn-stack-frontend.vercel.app/"],
  credentials: true,
}
app.use(cors(corsOptions));


//api's
app.use("/api/v1/user", userRouter);
app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/group", groupRouter);

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});


app.listen(PORT, () =>{
  console.log(`Server is running on port ${PORT}`);
})
