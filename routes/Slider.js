const express = require("express");
const { getAllSlider, createSlider } = require("../Controllers/SliderController");
const upload = require('../middleware/upload')
const router = express.Router();
router.get("/", getAllSlider);
router.post("/create", upload.single('image'), createSlider);
module.exports = router;