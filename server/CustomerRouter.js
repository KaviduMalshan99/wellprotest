const express = require('express');
const router = express.Router();
const CustomerContraller = require('./CustomerController');


router.get('/customer',CustomerContraller.getCustomer);
router.post('/addcustomer',CustomerContraller.addCustomer);
router.put('/updatecustomer',CustomerContraller.updateCustomer)
router.delete('/deletecustomer',CustomerContraller.deleteCustomer);

module.exports=router;