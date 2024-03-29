import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

// Key Id: rzp_test_01GaCZQAiE5gCv
// Key Secret: yT7xEfzzScNUseP76OGVl8dM
const router = express.Router();

router.post("/orders", async (req, res) => {
  console.log("In orders");
  console.log(req.body);
  try {
    const instance = new Razorpay({
      // key_id: process.env.KEY_ID,
      // key_secret: process.env.KEY_SECRET,

      key_id: "rzp_test_cmkZnIOVEjyaS0",
      key_secret: "OuY64FJEstNqjI4GN5CNGUGq",
    });

    const options = {
      // amount: 1 * 100,
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

router.post("/verify", async (req, res) => {
  console.log("In verify");
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      console.log("Payment verified successfully");
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      console.log("Payment Not successfully");
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

export default router;
