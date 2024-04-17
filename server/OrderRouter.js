const express = require('express');
const router = express.Router();
const OrderContraller = require ('./OrderController');

router.get('/oders',OrderContraller.getOrders);
router.post('/addorder',OrderContraller.addOrders);
router.put('/updateorder',OrderContraller.updateOrder);
router.delete('/deleteorder',OrderContraller.deleteOrder);

module.exports=router;