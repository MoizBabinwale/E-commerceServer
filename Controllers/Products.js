const { all } = require("axios");
const Products = require("../model/prducts")
const jwt = require("jsonwebtoken")
const User = require("../model/auth")

const Create = async (req, res) => {
    const { name, description, prize, quantity, productImage } = req.body;
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid authorization header" });
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodeToken = jwt.verify(token, process.env.JWT_SECRETE)
        var userId = decodeToken.id
        const newProduct = new Products({
            name, description, prize, quantity, userId, productImage
        })
        const createdProduct = await newProduct.save()
        res.status(201).json({
            message: "Product created successfully...!",
            product: createdProduct,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong...!" });
    }
}

const Delete = async (req, res) => {

}

const Update = async (req, res) => {

}

const GetAllProducts = async (req, res) => {
    try {
        const allProducts = await Products.find();
        const userIds = allProducts.map(product => product.userId);
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
            message: "Fetched Successfully...!"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const getProductDetail = async (req, res) => {
    const { id } = req.body
    try {
        const getProduct = await Products.findOne({ _id: id })
        if (!getProduct) {
            return res.status(404).json({ message: "Product Not Found...!" })
        }
        return res.status(200).json({
            product: getProduct
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

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
    var { name } = req.params
    try {
        const regex = new RegExp(name, 'i');
        const productList = await Products.find({ name: { $regex: regex } });
        if (productList.length === 0) {
            return res.status(404).json({ message: "No Products Found!" });
        }
        res.status(200).json(productList)
    } catch (error) {
        GetAllProducts()
        console.error(error);
        res.status(404).json({ message: "No Product Found!" })

    }
}
//Helper FUnction
function getUserIdFromToken(token) {
    try {
        console.log(token);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRETE);
        return decodedToken.id;
    } catch (error) {
        return null;
    }
}
module.exports = {
    Create, Delete, Update, GetAllProducts, GetProductsId, getProductDetail, filterProduct
}