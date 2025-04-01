const express = require('express');
const { auth, adminOnly, vendorOnly, buyerOnly } = require('../middlewares/auth');
const User = require('../models/usermodel');
const Order = require('../models/ordermodel');
const Product = require('../models/productmodel');
const Withdrawal = require('../models/withdrawalmodel');

const router = express.Router();

router.get('/admin-dashboard', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find();
        const orders = await Order.find();

        res.json({
            message: "Welcome to the Admin Dashboard",
            data: {
                users,
                orders,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Vendor Dashboard Route (Vendor only)
router.get('/vendor-dashboard', auth, vendorOnly, async (req, res) => {
    try {
        const vendorId = req.user._id;

        // Fetch products and orders related to this vendor
        const products = await Product.find({ vendor: vendorId });
        const orders = await Order.find({ vendor: vendorId });

        if (products.length === 0 || orders.length === 0) {
            return res.status(404).json({ message: "No products or orders found for this vendor" });
        }

        // Calculate total revenue from orders
        let totalRevenue = 0;
        orders.forEach(order => {
            totalRevenue += order.totalAmount;
        });

        // Calculate stock updates (total products sold)
        let stockUpdates = products.map(product => {
            const soldQuantity = orders.reduce((total, order) => {
                const productInOrder = order.items.find(item => item.product.toString() === product._id.toString());
                return total + (productInOrder ? productInOrder.quantity : 0);
            }, 0);
            return { productName: product.name, stockLeft: product.stock - soldQuantity };
        });

        res.json({
            message: "Welcome to the Vendor Dashboard",
            data: {
                products,
                orders,
                totalRevenue,
                stockUpdates,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get("/analytics", auth, vendorOnly, async (req, res) => {
    try {
        const vendorId = req.user.id;

        // Get total revenue and order count
        const orders = await Order.find({ "items.vendorId": vendorId });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const totalOrders = orders.length;

        // Get stock updates
        const products = await Product.find({ vendor: vendorId });
        const lowStock = products.filter(p => p.stock < 10);

        res.json({
            totalRevenue,
            totalOrders,
            lowStock,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Request withdrawal
router.post("/withdraw", auth, vendorOnly, async (req, res) => {
    try {
        const vendorId = req.user.id;
        const { amount, paymentMethod } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid withdrawal amount" });
        }

        const newWithdrawal = new Withdrawal({
            vendor: vendorId,
            amount,
            paymentMethod,
            status: "Pending",
        });

        await newWithdrawal.save();
        res.json({ message: "Withdrawal request submitted", withdrawal: newWithdrawal });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Get vendor's withdrawal requests
router.get("/withdrawals", auth, vendorOnly, async (req, res) => {
    try {
        const vendorId = req.user.id;
        const withdrawals = await Withdrawal.find({ vendor: vendorId });

        if (!withdrawals || withdrawals.length === 0) {
            return res.status(404).json({ message: "No withdrawal requests found" });
        }

        res.json({ withdrawals });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


router.get('/buyer-dashboard', auth, buyerOnly, async (req, res) => {
    try {
        const buyerId = req.user._id;

        // Validate buyer ID
        if (!buyerId) {
            return res.status(400).json({
                success: false,
                message: "Invalid user identification"
            });
        }

        // Fetch orders with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ buyer: buyerId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'items.product',
                select: 'name price images',
                model: 'Product'
            })
            .populate({
                path: 'seller',
                select: 'businessName',
                model: 'User'
            });

        // Format response
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt,
            seller: order.seller?.businessName || 'Unknown Seller',
            items: order.items.map(item => ({
                productId: item.product?._id,
                productName: item.product?.name || 'Deleted Product',
                price: item.price,
                quantity: item.quantity,
                image: item.product?.images?.[0] || null
            }))
        }));

        // Get total count for pagination
        const totalOrders = await Order.countDocuments({ buyer: buyerId });

        res.json({
            success: true,
            message: "Buyer dashboard data retrieved successfully",
            data: {
                orders: formattedOrders,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalOrders / limit),
                    totalOrders
                }
            }
        });

    } catch (error) {
        console.error('Buyer dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load dashboard data',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
        });
    }
});

module.exports = router;

module.exports = router;
