const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    userEmail: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    joinedData: { type: Date, default: Date.now },
})

module.exports = mongoose.model("User", UserSchema);