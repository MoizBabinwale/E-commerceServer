const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv').config()
const app = express()
require("./config/config")
const appRoute = require('./routes/user.js');
const productRoute = require('./routes/Product.js');
const sliderRoute = require('./routes/Slider.js');
app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.static('uploads'))
app.use(cors())
//Routes
app.use("/", ((req, res) => {
    res.send("<h1>Server Is Hosted on the Server [E-Commerce]</h1>")
}))
app.use("/api", appRoute);
app.use("/api/products", productRoute);
app.use("/api/sliders", sliderRoute)
const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Server running on port ${port}`));