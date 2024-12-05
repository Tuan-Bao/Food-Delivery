import express from "express";
import cors from "cors";
import { connectDB } from "./config/database.js";
import foodRouter from "./routes/foodRoute.js";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
dotenv.config();

// app config
const app = express();
const port = 3000;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads")); //  bất kỳ yêu cầu nào đến /images sẽ được xử lý bằng cách tìm tệp trong thư mục uploads
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
