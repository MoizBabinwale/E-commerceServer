const mongoose = require("mongoose");


const ProductSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    prize: { type: Number, required: true },
    quantity: { type: Number, required: true },
    userId: { type: String, required: true },
    productImage: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now // add a createdAt field with default value of current date/time
    }
});
module.exports = mongoose.model("Products", ProductSchema)
