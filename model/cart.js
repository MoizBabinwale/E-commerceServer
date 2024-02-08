const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
      },
      quantity: { type: Number, default: 1, required: true }
    }
  ]
});

module.exports = mongoose.model("Cart", CartSchema);
