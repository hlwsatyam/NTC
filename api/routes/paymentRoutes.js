const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/razorpay/order", paymentController.createRazorpayOrder);
router.post("/razorpay/verify", paymentController.verifyRazorpayPayment);

module.exports = router;
