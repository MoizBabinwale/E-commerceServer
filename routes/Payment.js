const express = require("express");
const { createOrder, paymentVerification } = require("../Controllers/PaymentCtrl");
const router = express.Router();

router.post("/createOrder", createOrder);
router.post("/paymentVerification", paymentVerification);
module.exports = router;
