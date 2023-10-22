const express = require("express");
const { getAllSlider, createSlider, deleteSlider } = require("../Controllers/SliderController");
const upload = require('../middleware/upload')
const router = express.Router();
router.get("/", getAllSlider);
router.post("/create", upload.single('image'), createSlider);
router.delete("/deleteSlider/:id", deleteSlider);
module.exports = router;