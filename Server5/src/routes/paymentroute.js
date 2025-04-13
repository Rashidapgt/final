const express = require('express');
const router = express.Router();
const { createStripeCheckoutSession } = require('../controllers/paymentcontroller');

// Route to create a Stripe Checkout session
router.post('/create-checkout-session', createStripeCheckoutSession);

module.exports = router;

