
const Cart = require('../models/cartmodel');
const Coupon = require('../models/couponmodel');
const User=require('../models/usermodel')

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
exports.applyCoupon = async (req, res) => {
  try {
    const { code, userLocation, cartItems } = req.body;
    const userId = req.user._id;

    console.log("🔹 User ID:", userId);

    const user = await User.findById(userId);
    if (!user || user.role !== 'buyer') {
      return res.status(403).json({ message: "Only buyers can apply coupons" });
    }

    if (!userLocation || !userLocation.country) {
      return res.status(400).json({ message: "User location is required" });
    }

    let cart = await Cart.findOne({ userId }).populate('items.productId');
    console.log("🔹 Cart Found:", cart ? "Yes" : "No");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty. Add items before applying a coupon." });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(400).json({ message: `Coupon code ${code} not found` });
    }

    if (coupon.validUntil && new Date() > coupon.validUntil) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    console.log("🔹 Cart Items from DB:", JSON.stringify(cart.items, null, 2));
    console.log("🔹 Cart Items from Frontend:", JSON.stringify(cartItems, null, 2));

    // **Fixing Order Amount Calculation**
    let totalAmount = 0;
    cartItems.forEach(item => {
      const cartItem = cart.items.find(cartItem =>
        cartItem.productId._id.toString() === item.productId.toString()
      );

      if (!cartItem) {
        console.log(`❌ Item not found in cart:`, item);
        return;
      }

      console.log(`✅ Calculating: ${cartItem.productId.name} | Price: ${cartItem.productId.price} | Quantity: ${item.quantity}`);

      totalAmount += parseFloat(cartItem.productId.price) * parseInt(item.quantity);
    });

    console.log("🔹 Final Calculated Total Amount:", totalAmount);
    console.log("🔹 Coupon Minimum Order Amount:", coupon.minOrderAmount);

    const minOrderAmount = Number(coupon.minOrderAmount);
    if (totalAmount < minOrderAmount) {
      return res.status(400).json({ message: `Order amount too low. Minimum required: ${minOrderAmount}` });
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
      message: "Coupon applied successfully",
      discountedAmount,
      shippingFee,
      tax,
      estimatedDeliveryTime,
      finalPrice,
      cartItems: cart.items, // Returning updated cart items
    });

  } catch (err) {
    console.error("❌ Error applying coupon:", err);
    res.status(500).json({ error: "Server error", details: err.message });
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

exports.getAvailableCoupons = async (req, res) => {
  try {
    // Fetch all active coupons (you can adjust conditions based on your needs)
    const availableCoupons = await Coupon.find({
      validUntil: { $gte: new Date() }, // Ensure the coupon is not expired
      isActive: true, // Only active coupons
    });

    if (availableCoupons.length === 0) {
      return res.status(404).json({ message: 'No available coupons found' });
    }

    res.status(200).json({
      message: 'Available coupons fetched successfully',
      coupons: availableCoupons,
    });
  } catch (err) {
    console.error('Error fetching available coupons:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

