const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/usermodel');
const Order = require('../models/ordermodel');
exports.register = async (req, res) => {
    try {
        console.log('Registration request body:', req.body);
        const { name, email, password, role, storeName } = req.body;

        // Ensure the role is one of the allowed values
        const allowedRoles = ['buyer', 'vendor', 'admin'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Additional validation for vendor role
        if (role === 'vendor' && !storeName) {
            return res.status(400).json({ message: 'Store name is required for vendors' });
        }

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            storeName,
            isApproved: role === 'vendor' ? false : true, // Set isApproved to false for vendors initially
        });

        // Save the new user to the database
        await user.save();

        // If the user is a vendor, notify them that approval is pending
        let message = 'User registered successfully';
        if (role === 'vendor') {
            message = 'Vendor registered successfully, awaiting admin approval.';
        }

        return res.status(201).json({ message, data: user });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No user found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

        // Generate JWT token with role included
        const token = jwt.sign(
            { id: user._id, email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set token as HttpOnly cookie
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.logout = async (req, res) => {
    try {
        res.cookie('token', '', { 
            httpOnly: true, 
            expires: new Date(0) // Expire the cookie immediately
        });
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.approveVendor = async (req, res) => {
    try {
      const { vendorId } = req.params;
  
      // Find the vendor by ID
      const vendor = await User.findById(vendorId);
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
  
      // Ensure the vendor is not already approved
      if (vendor.isApproved) {
        return res.status(400).json({ message: 'Vendor is already approved' });
      }
  
      // Approve the vendor
      vendor.isApproved = true;
      await vendor.save();
  
      return res.status(200).json({ message: 'Vendor approved successfully', vendor });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
 
 
  
  exports.getAdminStats = async (req, res) => {
    try {
      // Get total orders
      const totalOrders = await Order.countDocuments();
  
      // Get total revenue (Sum of totalAmount from all completed orders)
      const totalRevenue = await Order.aggregate([
        { $match: { paymentStatus: 'Completed' } },  // Match only completed orders
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }  // Sum the totalAmount
      ]);
  
      // Get total products (Assuming you want the total products in all orders)
      const totalProducts = await Order.aggregate([
        { $unwind: '$products' },  // Unwind the products array
        { $group: { _id: null, total: { $sum: '$products.quantity' } } }  // Sum the quantities of all products
      ]);
  
      // Get total vendors (users with role 'vendor')
      const totalVendors = await User.countDocuments({ role: 'vendor' });
  
      // Get total customers (users with role 'buyer')
      const totalCustomers = await User.countDocuments({ role: 'buyer' });
  
      return res.status(200).json({
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,  // If no revenue data, fallback to 0
        totalProducts: totalProducts[0]?.total || 0,  // If no product data, fallback to 0
        totalVendors,
        totalCustomers
      });
    } catch (error) {
      console.error('Error in stats:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  // Add this to your admin controller (after the existing methods)
  exports.getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // More comprehensive query with population if needed
        const user = await User.findById(userId)
            .select('-password -resetPasswordToken -resetPasswordExpire')
            .populate({
                path: 'store',
                select: 'name verificationStatus description logo banner',
                match: { isActive: true } // Only include active stores
            });

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Base profile data
        const profileData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        // Vendor-specific data
        if (user.role === 'vendor') {
            profileData.store = {
                id: user.store?._id,
                name: user.store?.name || user.storeName,
                slug: user.store?.slug,
                description: user.store?.description,
                logo: user.store?.logo,
                banner: user.store?.banner,
                verificationStatus: user.store?.verificationStatus || 
                                      (user.isApproved ? 'verified' : 'pending'),
                rating: user.store?.rating,
                totalProducts: user.store?.totalProducts,
                // Add any other store-related fields
            };
            
            // Add business information if needed
            profileData.businessInfo = {
                taxId: user.taxId,
                businessRegistration: user.businessRegistration,
                // Other compliance fields
            };
        }

        // Customer-specific data
        if (user.role === 'customer') {
            profileData.customerProfile = {
                addresses: user.addresses,
                wishlist: user.wishlist,
                cart: user.cart,
                // Other customer-specific fields
            };
        }

        return res.status(200).json({
            success: true,
            data: profileData
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Failed to fetch profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.getPendingVendors = async (req, res) => {
    try {
        const pendingVendors = await User.find({
            role: 'vendor',
            isApproved: false
        }).select('-password');

        return res.status(200).json({
            count: pendingVendors.length,
            vendors: pendingVendors
        });
    } catch (error) {
        console.error('Error fetching pending vendors:', error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
