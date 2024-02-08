const Products = require("../model/prducts");
const jwt = require("jsonwebtoken");
const User = require("../model/auth");
const mongoose = require("mongoose");
const Cart = require("../model/cart");

const Create = async (req, res) => {
  try {
    const { name, description, prize, quantity, productImage, Id } = req.body;

    // Check authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing or invalid authorization header" });
    }

    // Verify JWT token
    let userId;
    try {
      userId = getUserIdFromToken(token);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userInfo = await User.findOne({ _id: userId });
    if (!(userInfo && userInfo.isAdmin)) {
      return res.status(403).json({ message: "Only admin users can create products." });
    }

    if (Id) {
      try {
        const objectId = new mongoose.Types.ObjectId(Id.trim());
        // Update existing product
        const updateProduct = await Products.findOneAndUpdate({ _id: objectId }, { $set: { name, description, prize, quantity, productImage } }, { new: true });

        if (!updateProduct) {
          return res.status(404).json({ error: "Product not found" });
        }

        return res.json({
          message: "Product Updated!",
          product: updateProduct,
        });
      } catch (error) {
        console.error("Error converting to ObjectId:", error);
        return res.status(400).json({ error: "Invalid ObjectId format for _id" });
      }
    }

    // Create a new product
    const newProduct = new Products({
      name,
      description,
      prize,
      quantity,
      userId,
      productImage,
    });
    const createdProduct = await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully!",
      product: createdProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

const Delete = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedProduct = await Products.findOneAndDelete({ _id: id });

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetAllProducts = async (req, res) => {
  try {
    const allProducts = await Products.find();
    const userIds = allProducts.map((product) => product.userId);
    const users = await User.find({ _id: { $in: userIds } });

    for (const i in users) {
      for (const j in allProducts) {
        if (users[i]._id.equals(allProducts[j].userId)) {
          allProducts[j].userName = users[i].name;
        }
      }
    }
    res.status(201).json({
      products: allProducts,
      message: "Fetched Successfully...!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getProductDetail = async (req, res) => {
  const { id } = req.body;
  try {
    const getProduct = await Products.findOne({ _id: id });
    if (!getProduct) {
      return res.status(404).json({ message: "Product Not Found...!" });
    }
    return res.status(200).json({
      product: getProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const GetProductsId = async (req, res) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid authorization header" });
  }
  const token = req.headers.authorization.split(" ")[1]; // Extract the JWT token from the request headers
  const userIdFromToken = getUserIdFromToken(token);
  const userId = req.params.userid;
  try {
    if (userId !== userIdFromToken) {
      return res.status(403).json({ message: "You do not have permission to view these products" });
    } else {
      const userProducts = await Products.find({ userId });

      res.status(200).json({
        message: "User's products retrieved successfully",
        products: userProducts,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const filterProduct = async (req, res) => {
  var { name } = req.params;
  try {
    const regex = new RegExp(name, "i");
    const productList = await Products.find({ name: { $regex: regex } });
    if (productList.length === 0) {
      return res.status(404).json({ message: "No Products Found!" });
    }
    res.status(200).json(productList);
  } catch (error) {
    GetAllProducts();
    console.error(error);
    res.status(404).json({ message: "No Product Found!" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, addedFrom } = req.body;

    console.log(productId, quantity);
    //   try {
    //  const objID =   mongoose.Types.ObjectId(productId.trim());
    //  console.log(objID);
    const productInfo = await Products.findOne({ _id: productId });
    if (!productInfo) {
      return res.status(404).json({ message: "Product Not Found!" });
    }
    //   } catch (error) {
    //   return  res.status(404).json({message:"Error Object Id Format"})
    //   }
    // Check if the product exists

    // Extract the user ID from the JWT token
    const token = req.headers.authorization.split(" ")[1];
    const userIdFromToken = getUserIdFromToken(token);

    // Check if the user has an existing cart
    let userCart = await Cart.findOne({ userId: userIdFromToken });

    if (!userCart) {
      // If the user doesn't have a cart, create a new one
      userCart = new Cart({ userId: userIdFromToken, items: [] });
    }

    // Check if the product is already in the user's cart
    const existingItemIndex = userCart.items.findIndex((item) => item.productId.equals(productId));

    if (existingItemIndex !== -1) {
      // If the product is already in the cart, update the quantity
      if (addedFrom === "CART" && userCart.items[existingItemIndex].quantity >= quantity) {
        userCart.items[existingItemIndex].quantity = quantity || 1;
      } else {
        userCart.items[existingItemIndex].quantity += quantity || 1;
      }
    } else {
      // If the product is not in the cart, add it
      userCart.items.push({ productId, quantity: quantity || 1 });
    }

    // Save the updated cart
    await userCart.save();

    return res.status(200).json({ message: "Product added to the cart", cart: userCart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const productInfo = await Products.findOne({ _id: productId });
    if (!productInfo) {
      return res.status(404).json({ message: "Product Not Found!" });
    }
    // Extract the user ID from the JWT token
    const token = req.headers.authorization.split(" ")[1];
    const userIdFromToken = getUserIdFromToken(token);

    // Check if the user has an existing cart
    let userCart = await Cart.findOne({ userId: userIdFromToken });

    // Check if the product is already in the user's cart
    const existingItemIndex = userCart.items.findIndex((item) => item.productId.equals(productId));
    // If the product is already in the cart, then Remove that item
    userCart.items.pop(existingItemIndex, -1);
    await userCart.save();
    return res.status(200).json({
      message: "Product Successfully Removed From cart",
      cart: userCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

//Helper FUnction
function getUserIdFromToken(token) {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRETE);
    return decodedToken.id;
  } catch (error) {
    return null;
  }
}

module.exports = {
  Create,
  Delete,
  GetAllProducts,
  GetProductsId,
  getProductDetail,
  filterProduct,
  addToCart,
  removeFromCart,
};
