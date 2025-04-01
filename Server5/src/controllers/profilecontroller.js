
exports.createProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profileData = {
      user: userId,
      personalInfo: req.body.personalInfo,
      addresses: req.body.addresses
    };

    // Add vendor-specific data if user is a vendor
    if (user.role === 'vendor') {
      profileData.vendorInfo = {
        storeName: req.body.storeName,
        storeDescription: req.body.storeDescription,
        // ... other vendor fields
      };
    }

    const profile = await Profile.create(profileData);
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Vendor Profile Controller
exports.getVendorProfiles = async (req, res) => {
    try {
      // Authentication check
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      // Build query
      const query = { role: 'vendor', isApproved: true };
      if (req.query.search) {
        query.$or = [
          { businessName: { $regex: req.query.search, $options: 'i' } },
          { 'address.city': { $regex: req.query.search, $options: 'i' } }
        ];
      }
  
      // Get vendors with pagination
      const vendors = await User.find(query)
        .select('-password -__v')
        .skip(skip)
        .limit(limit)
        .lean();
  
      const total = await User.countDocuments(query);
  
      res.status(200).json({
        success: true,
        count: vendors.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: vendors
      });
  
    } catch (error) {
      console.error('Vendor profiles error:', error);
      res.status(500).json({
        error: 'Failed to fetch vendor profiles',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };