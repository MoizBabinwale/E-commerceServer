const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const app = express();
const path = require("path");
require("./config/config");
const appRoute = require("./routes/user.js");
const productRoute = require("./routes/Product.js");
const sliderRoute = require("./routes/Slider.js");
const paymentRoute = require("./routes/Payment.js");
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.static("uploads"));
app.use(cors());

//Routes
app.use("/api", appRoute);
app.use("/api/products", productRoute);
app.use("/api/sliders", sliderRoute);
app.use("/api/payment", paymentRoute);

const port = process.env.PORT || 5001;

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => console.log(`Server running on port ${port}`));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public", "index.htm"));
});
const isTestMode = process.env.NODE_ENV === "test" ? true : false;

app.get("/get/paymentKey", (req, res) => {
  res.status(200).json({ key: isTestMode ? process.env.TEST_KEY_ID : process.env.KEY_ID });
});

app.get("/*", (req, res) => {
  res.send("Web Page Not Found!");
});
