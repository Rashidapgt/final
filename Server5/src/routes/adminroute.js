const express=require('express')
const{register,login,logout,approveVendor,getAdminStats,getMyProfile,getPendingVendors}=require('../controllers/admincontroller')
const router=express.Router()
const { auth, adminOnly } = require('../middlewares/auth');

router.post('/register',register)
router.post('/login',login)
router.post('/logout', logout)
router.put('/approve-vendor/:vendorId', auth, adminOnly, approveVendor); 
router.get('/stats', auth, getAdminStats);
router.get('/me', auth, getMyProfile);
router.get('/pending-vendors', auth, adminOnly,getPendingVendors);



module.exports=router;