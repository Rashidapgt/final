// models/Profile.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Common Fields for All Users
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date }
  },
  addresses: [{
    type: { 
      type: String, 
      enum: ['home', 'work', 'billing', 'shipping'],
      required: true
    },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'US' },
    isDefault: { type: Boolean, default: false }
  }],
  // Vendor-Specific Fields (only populated when role=vendor)
  vendorInfo: {
    storeName: {
      type: String,
      required: function() { return this.user?.role === 'vendor'; },
      unique: true,
      trim: true
    },
    storeDescription: { type: String },
    businessRegistrationNumber: { type: String },
    taxId: { type: String },
    policies: {
      shipping: { type: String },
      returns: { type: String },
      payment: { type: String }
    },
    socialMedia: {
      website: { type: String },
      facebook: { type: String },
      instagram: { type: String }
    }
  },
  // Admin-Specific Fields (if needed)
  adminInfo: {
    permissions: [String],
    department: { type: String }
  }
}, { timestamps: true });

// Indexes for better query performance
ProfileSchema.index({ 'vendorInfo.storeName': 'text', 'personalInfo.firstName': 'text', 'personalInfo.lastName': 'text' });

// Middleware to validate vendor-specific fields
ProfileSchema.pre('validate', function(next) {
  if (this.user?.role === 'vendor' && !this.vendorInfo?.storeName) {
    this.invalidate('vendorInfo.storeName', 'Store name is required for vendors');
  }
  next();
});

module.exports = mongoose.model('Profile', ProfileSchema);