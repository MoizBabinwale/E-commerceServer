const mongoose = require("mongoose");


const sliderSchema = mongoose.Schema({

    name: { type: String, required: true },
    image: { type: String, required: true }
});

module.exports = mongoose.model("Slider", sliderSchema)
