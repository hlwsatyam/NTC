const crypto = require("crypto");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Razorpay = require("razorpay");

let razorpay = null;

const getRazorpayInstance = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

exports.createRazorpayOrder = catchAsyncErrors(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount provided.",
    });
  }

  const options = {
    amount: Math.round(Number(amount) * 100), // amount in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await getRazorpayInstance().orders.create(options);

  res.status(201).json({
    success: true,
    order,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

exports.verifyRazorpayPayment = catchAsyncErrors(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Missing payment details.",
    });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed.",
    });
  }

  res.status(200).json({
    success: true,
    message: "Payment verified successfully.",
  });
});
