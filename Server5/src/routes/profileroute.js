const express = require('express');
const router = express.Router();
const {getVendorProfiles} = require('../controllers/profilecontroller');
const { auth} = require('../middlewares/auth');


router.post(
  '/users/:userId/profile',
  auth
);


router.get(
  '/vendors',getVendorProfiles
);

module.exports = router;