const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router()
const { Create, Delete, Update, GetAllProducts, getProductDetail, GetProductsId, filterProduct } = require('../Controllers/Products.js');
router.post("/create", Create);
router.post("/delete", Delete);
router.post("/update/:id", auth, Update);
router.get("/", GetAllProducts);
router.post("/getdetail", getProductDetail);
router.get("/:userid", GetProductsId);
router.get("/filter/:name", filterProduct);
module.exports = router