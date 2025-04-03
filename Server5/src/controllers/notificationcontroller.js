const Order = require("../models/ordermodel");
const User = require("../models/usermodel");
const { sendEmailNotification } = require("../config/email");
const Notification=require("../models/notificationmodel") 
const mongoose=require('mongoose')

// ✅ Notify Vendor About a New Order
exports.notifyVendorOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) return res.status(400).json({ message: "Order ID is required" });

        const order = await Order.findById(orderId).populate("products.product");
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (!order.products || order.products.length === 0) {
            return res.status(400).json({ message: "No products found in order" });
        }

        const product = order.products[0].product;
        if (!product || !product.vendor) {
            return res.status(404).json({ message: "Vendor not found for this product" });
        }

        const vendor = await User.findById(product.vendor);
        if (!vendor) return res.status(404).json({ message: "Vendor not found" });

        const subject = "New Order Received!";
        const message = `Hello ${vendor.name},\n\nYou have received a new order (Order ID: ${order._id}).\nPlease check your vendor dashboard for details.\n\nThank you.`;

        const emailResult = await sendEmailNotification(vendor.email, subject, message);
        
        // Check if email was sent successfully
        if (!emailResult.success) {
            console.error(`Error sending email to ${vendor.email}:`, emailResult.error);
            return res.status(500).json({ message: "Error sending email notification" });
        }

        // Save notification in database
        await Notification.create({
            recipient: vendor._id,
            type: "order",
            content: `New order received: ${order._id}`,
            relatedEntity: order._id
        });

        res.json({ message: "📩 Email notification sent to vendor" });
    } catch (error) {
        console.error("Error in notifyVendorOrder:", error);
        res.status(500).json({ message: "Error sending email notification", error: error.message });
    }
};

// ✅ Notify Customer About Order Status Change
exports.notifyCustomerOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) return res.status(400).json({ message: "Order ID and status are required" });

        const order = await Order.findById(orderId).populate("customer");
        if (!order) return res.status(404).json({ message: "Order not found" });

        const customer = await User.findById(order.customer._id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        const subject = "Order Status Updated";
        const message = `Hello ${customer.name},\n\nYour order (Order ID: ${order._id}) status has been updated to: ${status}.\n\nThank you for shopping with us!`;

        const emailResult = await sendEmailNotification(customer.email, subject, message);
        
        // Check if email was sent successfully
        if (!emailResult.success) {
            console.error(`Error sending email to ${customer.email}:`, emailResult.error);
            return res.status(500).json({ message: "Error sending email notification" });
        }

        // Save notification in database
        await Notification.create({
            recipient: customer._id,
            type: "order-status",
            content: `Your order status has changed to: ${status}`,
            relatedEntity: order._id
        });

        res.json({ message: "📩 Email notification sent to customer" });
    } catch (error) {
        console.error("Error in notifyCustomerOrderStatus:", error);
        res.status(500).json({ message: "Error sending email notification", error: error.message });
    }
};

//✅ Notify Admin About a New Vendor Signup
exports.notifyAdminVendorSignup = async (req, res) => {
    try {
        const { vendorId } = req.body;

        // Validate if vendorId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).json({ error: "Invalid vendor ID format" });
        }

        const vendor = await User.findById(vendorId);  // Assuming you fetch from User model
        if (!vendor) return res.status(404).json({ error: "Vendor not found" });

        // Fetch all admins from the User collection (filtering by role 'admin')
        const admins = await User.find({ role: "admin" }).select("_id email");
        if (!admins.length) return res.status(404).json({ error: "No admin users found" });

        // Create notification data for admins
        const notifications = admins.map(admin => ({
            recipient: admin._id,
            type: "vendor-signup",
            content: `New vendor registration: ${vendor.businessName || vendor.name}`,
            relatedEntity: vendorId
        }));

        // Save notifications in the database
        await Notification.insertMany(notifications);

        // Send email notifications to admins
        admins.forEach(admin => {
            sendEmailNotification(admin.email, "New Vendor Signup", `A new vendor has signed up: ${vendor.businessName || vendor.name}. Please review their application.`);
        });

        res.status(200).json({
            success: true,
            message: "Admins notified successfully"
        });
    } catch (error) {
        console.error("Error in notifyAdminVendorSignup:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



exports.getNotificationsForUser = async (req, res) => {
    try {
        const { role, userId } = req.params;

        // Validate userId and role
        if (!role || !userId) {
            return res.status(400).json({ message: "Role and User ID are required" });
        }

        // Fetch notifications based on role and userId
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 }); // Sort by newest first

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found" });
        }

        // Optional: Filter based on role (if you want specific types of notifications)
        // For example, admins might only care about certain types of notifications, 
        // vendors might get order notifications, etc.
        if (role === 'admin') {
            // Admin-specific logic (e.g., show vendor signups, order issues)
            // You can filter notifications based on type if needed
        } else if (role === 'vendor') {
            // Vendor-specific logic (e.g., show new orders)
        } else if (role === 'customer') {
            // Customer-specific logic (e.g., show order status updates)
        }

        res.json(notifications); // Send notifications to the frontend
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
};
