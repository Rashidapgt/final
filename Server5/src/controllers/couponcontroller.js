
const Cart = require('../models/cartmodel');
const Coupon = require('../models/couponmodel');

// Calculate Shipping Fee
const calculateShippingFee = (cart, userLocation) => {
  if (userLocation.country === 'US') {
    return 10;
  }
  return 20;
};

// Calculate Tax
const calculateTax = (cart, userLocation) => {
  const taxRate = userLocation.country === 'US' ? 0.08 : 0.2;
  const totalAmount = cart.items.reduce((total, item) => {
    const productPrice = item.productId.price;
    return total + productPrice * item.quantity;
  }, 0);
  return totalAmount * taxRate;
};

// Calculate Estimated Delivery Time
const calculateEstimatedDeliveryTime = (userLocation) => {
  return userLocation.country === 'US' ? '3-5 business days' : '7-14 business days';
};

// Apply Coupon
exports.applyCoupon = async (req, res) => {
  const { code, userLocation } = req.body;
  const userId = req.user._id;
  const user = await User.findById(userId);  // Assuming you have a User model
  if (!user || user.role !== 'buyer') {
    return res.status(403).json({ message: 'Only buyers can apply coupons' });
  }

  if (!userLocation || !userLocation.country) {
    return res.status(400).json({ message: 'User location is required' });
  }

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: `Cart not found for user ${userId}` });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(400).json({ message: `Coupon code ${code} not found` });
    }

    if (coupon.validUntil && new Date() > coupon.validUntil) {
      return res.status(400).json({ message: 'Coupon expired' });
    }

    const totalAmount = cart.items.reduce((total, item) => {
      const productPrice = item.productId.price;
      return total + productPrice * item.quantity;
    }, 0);

    if (totalAmount < coupon.minOrderAmount) {
      return res.status(400).json({ message: 'Order amount too low for this coupon' });
    }

    const discount = (totalAmount * coupon.discountPercentage) / 100;
    const discountedAmount = totalAmount - discount;

    const shippingFee = calculateShippingFee(cart, userLocation);
    const tax = calculateTax(cart, userLocation);
    const estimatedDeliveryTime = calculateEstimatedDeliveryTime(userLocation);

    const finalPrice = discountedAmount + shippingFee + tax;

    cart.appliedCoupon = {
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      discountAmount: discount,
    };
    cart.totalAfterDiscount = discountedAmount;
    await cart.save();

    res.status(200).json({
      message: 'Coupon applied successfully',
      discountedAmount,
      shippingFee,
      tax,
      estimatedDeliveryTime,
      finalPrice,
    });
  } catch (err) {
    console.error('Error applying coupon:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Get Available Coupons
exports.getAvailableCoupons = async (req, res) => {
  try {
    const currentDate = new Date();
    console.log('Current Date:', currentDate);

    const coupons = await Coupon.find({
      isActive: true, // Only fetch active coupons
      validUntil: { $gte: currentDate }, // Only fetch non-expired coupons
    });
    console.log('Fetched Coupons:', coupons);

    if (!coupons || coupons.length === 0) {
      return res.status(200).json({ message: "No available coupons", coupons: [] });
    }

    res.status(200).json({ coupons });
  } catch (err) {
    console.error("Error fetching coupons:", err);
    res.status(500).json({ error: "Failed to fetch coupons", details: err.message });
  }
};

// Create Coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, minOrderAmount, validUntil, isActive } = req.body;

    // Validate that all fields are provided
    if (!code || !discountPercentage || !minOrderAmount || !validUntil) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the coupon already exists
    let existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    // Create new coupon
    const newCoupon = new Coupon({
      code: code.toUpperCase(),
      discountPercentage,
      minOrderAmount,
      validUntil: new Date(validUntil), // Ensure validUntil is treated as a Date object
      isActive: isActive ?? true, // Default to active if not provided
    });

    await newCoupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon: newCoupon });
  } catch (err) {
    console.error('Error creating coupon:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

