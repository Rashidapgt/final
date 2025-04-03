const Product = require('../models/productmodel');
const { cloudinary, uploadMiddleware } = require('../config/cloudinary'); // Import the uploadMiddleware
const Category = require('../models/categorymodel');
const mongoose = require("mongoose");

exports.createProduct = async (req, res) => {
    try {
        uploadMiddleware.single('file')(req, res, async (err) => {  // Use uploadMiddleware here
            if (err) return res.status(400).json({ message: err.message });

            const { name, description, price, category, stock } = req.body;

            // Ensure the vendor is logged in
            if (req.user.role !== 'vendor') {
                return res.status(403).json({ message: 'Only vendors can create products' });
            }

            // Check if category is provided and is a valid ObjectId
            if (!category || !mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: "Invalid category ID format or category not provided." });
            }

            // Ensure the category exists in the database
            const categoryDoc = await Category.findById(category);
            if (!categoryDoc) {
                return res.status(400).json({ message: 'Category not found' });
            }

            // Handle image upload to Cloudinary if a file is provided
            let imageUrl = null;
            if (req.file) {
                try {
                    const result = await cloudinary.uploader.upload(req.file.path, { folder: "products" });
                    imageUrl = result.secure_url;  // Save the Cloudinary URL to the product image
                } catch (uploadError) {
                    return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: uploadError.message });
                }
            }

            // Create new product document
            const newProduct = new Product({
                name,
                description,
                price,
                category: categoryDoc._id,  // Use the ObjectId here
                stock,
                images: imageUrl,
                vendor: req.user._id  // Vendor is stored in req.user._id (set by the auth middleware)
            });

            await newProduct.save();

            // Send back the created product details
            res.status(201).json({
                message: 'Product created successfully',
                product: {
                    _id: newProduct._id,
                    name: newProduct.name,
                    description: newProduct.description,
                    price: newProduct.price,
                    stock: newProduct.stock,
                    images: newProduct.images,  // Include image URL in the response
                    category: newProduct.category,
                    vendor: newProduct.vendor
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all products with optional category filter
exports.getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {};

        if (category) {
            // Validate if category is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }
            filter.category = category; // Filtering by valid ObjectId category
        }

        // Fetch products based on filter
        const products = await Product.find(filter)
            .populate("category", "name")
            .populate("vendor", "name")
            .exec();

        if (!products.length) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get a product by ID (Public access)
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID format." });
        }

        const product = await Product.findById(id)
            .populate('category', 'name')  // Populate category name
            .populate('vendor', 'name')    // Populate vendor name (optional)
            .exec();

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Product (Vendor/Admin only)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock } = req.body;

        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the user is the product owner (vendor) or an admin
        if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized to update this product" });
        }

        // Update category if provided and validate ObjectId
        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }
            const categoryDoc = await Category.findById(category);
            if (!categoryDoc) {
                return res.status(400).json({ message: "Category not found" });
            }
            product.category = categoryDoc._id; // Assign the ObjectId of the category
        }

        // Update image if a new file is uploaded
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, { folder: "products" });
                product.images = result.secure_url; // Save the new Cloudinary URL
            } catch (uploadError) {
                return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
            }
        }

        // Update other fields only if provided
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (stock) product.stock = stock;

        await product.save();
        return res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        console.log("User attempting to delete:", req.user); // Debugging

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized to delete this product" });
        }

        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
