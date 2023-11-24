import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./Routes/payment.js";

dotenv.config();
console.log(process.env.KEY_ID);
console.log(process.env.KEY_SECRET);
const PORT = 8080;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Works fine 💚");
});

app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
