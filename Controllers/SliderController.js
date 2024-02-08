const Slider = require("../model/slider.js");

const getAllSlider = async (req, res) => {
  try {
    const response = await Slider.find();
    res
      .status(200)
      .json({ message: "Fetched Successfully", sliders: response });
  } catch (error) {
    console.log("error ", error);
    res.status(404).json({ message: "No Slider Image Found" });
  }
};

const createSlider = async (req, res) => {
  var { name } = req.body;
  var path = req.file.path;
  var tempImage = path.split("\\");
  var image = tempImage[1];
  try {
    const newSlider = new Slider({
      name,
      image
    });
    const response = await newSlider.save();
    if (response) {
      res
        .status(200)
        .json({ message: "Slider Created Successfully", sliders: response });
    }
  } catch (error) {
    console.log("error ", error);
    res.status(404).json({ message: "Something Went Wrong" });
  }
};

const deleteSlider = async (req, res) => {
  var { id } = req.params;
  try {
    const deletedSlider = await Slider.deleteOne({ _id: id });
    if (!deletedSlider) {
      return res.status(404).json({ message: "Slider not found" });
    }
    res.json({ message: "Slider deleted successfully" });
  } catch (error) {
    console.log("error ", error);
    res.status(404).json({ message: "File Can not be deleted!" });
  }
};

module.exports = {
  getAllSlider,
  createSlider,
  deleteSlider
};
