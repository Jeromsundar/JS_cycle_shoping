const product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

// Create Product
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await product.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!updatedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    try {
        const deletedProduct = await product.findByIdAndDelete(id);

        if (!deletedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.status(200).json({ message: "Product deleted successfully", deletedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a Single Product
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    try {
        const foundProduct = await product.findById(id);

        if (!foundProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.status(200).json(foundProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Products
const getAllProduct = asyncHandler(async (_req, res) => {
   
    try {
        const allProducts = await product.find(_req.query);
        res.status(200).json(allProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
};
