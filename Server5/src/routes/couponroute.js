const express = require('express');
const router = express.Router();
const { applyCoupon,getAvailableCoupons ,createCoupon} = require('../controllers/couponcontroller')
const { auth ,buyerOnly} = require('../middlewares/auth');

// Define the route to apply coupon
router.post('/apply', auth, buyerOnly, applyCoupon);
router.get("/available", getAvailableCoupons);
router.post('/create', auth, createCoupon);

module.exports = router;
