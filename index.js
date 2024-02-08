const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const app = express();
const path = require("path");
require("./config/config");
const appRoute = require("./routes/user.js");
const productRoute = require("./routes/Product.js");
const sliderRoute = require("./routes/Slider.js");
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.static("uploads"));
app.use(cors());
//Routes
app.use("/api", appRoute);
app.use("/api/products", productRoute);
app.use("/api/sliders", sliderRoute);
const port = process.env.PORT || 5001;

app.use(express.static(path.join(__dirname, "public")));
app.listen(port, () => console.log(`Server running on port ${port}`));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public", "index.htm"));
});
app.get("/*", (req, res) => {
  res.send("Web Page Not Found!");
});
