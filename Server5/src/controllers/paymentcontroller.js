const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/ordermodel');

exports.createStripeCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('products.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!order.totalAmount || order.totalAmount <= 0)
      return res.status(400).json({ message: 'Invalid order total amount' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.products.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `http://localhost:5173/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/checkout`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    res.status(200).json({ sessionId: session.id });

  } catch (error) {
    console.error('Stripe Checkout session error:', error);
    res.status(500).json({ error: 'Failed to create Stripe Checkout session', message: error.message });
  }
};


