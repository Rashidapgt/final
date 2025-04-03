const express = require("express");
const router = express.Router();
const {
    notifyVendorOrder,
    notifyCustomerOrderStatus,
    notifyAdminVendorSignup,
    getNotificationsForUser
} = require("../controllers/notificationcontroller");

// Route to notify vendor about a new order
router.post("/vendor/order", notifyVendorOrder);

// Route to notify customer about order status change
router.post("/customer/order-status", notifyCustomerOrderStatus);

// Route to notify admin about a new vendor signup
router.post("/admin/vendor-signup", notifyAdminVendorSignup);

// GET route to fetch notifications for a specific user (admin, vendor, or buyer)
router.get("/notifications/:role/:userId", getNotificationsForUser);


module.exports = router;

