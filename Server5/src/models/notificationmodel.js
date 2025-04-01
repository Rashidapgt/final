const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',  // Reference to the User model (vendor, customer, admin)
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['order', 'order-status', 'vendor-signup'],  // Types of notifications
        },
        content: {
            type: String,
            required: true,
        },
        relatedEntity: {
            type: mongoose.Schema.Types.ObjectId,  // The entity related to the notification (order, vendor, etc.)
            required: true,
        },
        read: {
            type: Boolean,
            default: false,  // Track whether the notification has been read
        },
        createdAt: {
            type: Date,
            default: Date.now,  // Timestamp when notification was created
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

