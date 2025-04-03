const jwt = require('jsonwebtoken');
const Review = require('../models/reviewmodel');
const { auth } = require('../middlewares/auth'); // Import auth middleware
const Product=require("../models/productmodel")




exports.createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;
        const buyer = req.user._id; // The buyer is the authenticated user

        console.log('Received review data:', { product, rating, comment });

        // Check if the product exists in the database
        const foundProduct = await Product.findById(product);
        if (!foundProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create a new review
        const newReview = new Review({
            buyer,
            product,
            rating,
            comment,
        });

        // Save the review to the database
        await newReview.save();
        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        console.error('Error in creating review:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all reviews
// In your getAllReviews controller
exports.getAllReviews = async (req, res) => {
    try {
      const { productId } = req.query;
      let query = {};
      
      if (productId) {
        query.product = productId;
      }
  
      const reviews = await Review.find(query).populate('buyer', 'name');
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Get review by ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('buyer', 'name email').populate('product', 'name');
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update review (only the buyer who created the review or admin can update the review)
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Ensure that only the buyer who created the review or an admin can update it
        if (review.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this review' });
        }

        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete review (only the buyer who created the review or admin can delete the review)
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Ensure that only the buyer who created the review or an admin can delete it
        if (review.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this review' });
        }

        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
