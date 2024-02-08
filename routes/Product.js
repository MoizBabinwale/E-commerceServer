const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();
const {
  Create,
  Delete,
  GetAllProducts,
  getProductDetail,
  GetProductsId,
  filterProduct,
  addToCart,
  removeFromCart
} = require("../Controllers/Products.js");
router.post("/create", auth, Create);
router.post("/delete", auth, Delete);
// router.post("/update/:id", auth, Update);
router.get("/", GetAllProducts);
router.post("/getdetail", getProductDetail);
router.get("/:userid", GetProductsId);
router.get("/filter/:name", filterProduct);
router.post("/addToCart", auth, addToCart);
router.post("/removeFromCart", auth, removeFromCart);
module.exports = router;
