const express = require('express');
const router = express.Router();
const contraller = require('./contraller');
const { route } = require('./app');




const { addCoupon, validateCoupon, getAllCoupons,deactivateCoupon } = require('./CouponController');

const catagoryContraller = require('./CatagoryController');
const customerContraller = require('./CustomerController');
const orderContraller = require('./OrderController');
const productContraller = require('./ProductController'); 
const reviewcontroller = require('./ReviewController');
const faqcontroller = require('./FaqController');
const RefundController = require('./RefundController');
const SupplierRegController = require('./SupplierRegController');
const SupplierStockController = require('./SupplierStockController');
const cartController = require('./AddtocartContraller')
const shippingMethodController = require('./ShippingMethodController');



const authMiddleware = require("../server/middleware/authMiddleware");
const USER_ROLES = require("../server/constants/roles");


router.get('/users',contraller.getUsers);
router.post('/createuser',contraller.addUser);
router.post('/updateuser',contraller.updateUser);
router.post('/deleteuser',contraller.deleteUser);


//category
router.get('/categories',catagoryContraller.getCategories);
router.post('/addcategories',catagoryContraller.addCategory);
router.post('/deletecategories/:id',catagoryContraller.deleteCategory);
router.post('/updatecategory/:id', catagoryContraller.updateCategory);

//addtocart
router.get('/cart/:customerId',  cartController.getCart);
router.post('/cart/add', cartController.addToCart);
router.put('/updatecart',  cartController.updateCartItem);
router.delete('/deletecart/:cartId', cartController.removeCartItem);


//customer
router.get(
    "/customer",
    authMiddleware([USER_ROLES.ADMIN]),
    customerContraller.getCustomer
);

router.post("/addcustomer", customerContraller.addCustomer);
router.post("/updatecustomer/:UserId", customerContraller.updateCustomer);
router.delete("/deletecustomer/:UserId", customerContraller.deleteCustomer);
router.post("/login", customerContraller.login); // Ensure this is a POST, not GET
router.post("/register", customerContraller.register);
router.get("/customer/:userId", customerContraller.getCustomerById);
router.get("/customer/email/:email", customerContraller.getCustomerByEmail);

//order
router.get('/orders',orderContraller.getOrders);
router.post('/addOrder',orderContraller.addOrder);
router.put('./updateOrder',orderContraller.updateOrder);
router.delete('/deleteOrder/:orderId',orderContraller.deleteOrder);
router.get('/getOrder/:orderId',orderContraller.getOrderById);

//product
router.get('/products',productContraller.getProducts);
router.get('/products/:productId', productContraller.getProductById);
router.post('/addproduct', productContraller.addProduct);
router.put('/updateproduct/:productId', productContraller.updateProduct);
router.delete('/deleteproduct/:ProductId',productContraller.deleteProduct);


//review
router.get('/reviews',reviewcontroller.getReview);
router.get('/review/:ReviewID',reviewcontroller.getReviewById)
router.post('/addreviews',reviewcontroller.addReview);
router.post('/updatereview/:ReviewID',reviewcontroller.updateReview);
router.delete('/deletereview/:ReviewID',reviewcontroller.deleteReview);

//faq
router.get('/faqs',faqcontroller.getFaq);
router.post('/addfaqs',faqcontroller.addFaq);
router.delete('/deletefaq/:FaqID',faqcontroller.deleteFaq);
router.get('/faq/:FaqID', faqcontroller.getFaqById);

//refund
router.post('/addrefund', RefundController.addRefund);
router.get('/refunds', RefundController.getRefunds);
router.delete('/deleterefund/:id', RefundController.deleteRefund);
router.put('/updaterefund/:orderId', RefundController.updateRefund);
router.get('/refund/:orderId', RefundController.getRefundById);


// //refundemail
// const { sendEmail } = require("../controllers/emailControllers");

// router.post("/sendEmail", sendEmail);

//supplierReg

router.post('/addsupplier', SupplierRegController.addSupplierReg);
router.get('/suppliers', SupplierRegController.getSuppliers);
//router.get('/supplierdetails/:userId',SupplierRegController.getSuppliersdetails);
router.put('/suppliers/:id', SupplierRegController.updateSupplier);
router.delete('/suppliers/:id', SupplierRegController.deleteSupplier);

//suplierstock
router.post('/addstock', SupplierStockController.addSupplierStock);
router.get('/getstock', SupplierStockController.getStock);


// Shipping Methods
router.post('/shippingMethods', shippingMethodController.addShippingMethod);
router.get('/shippingMethods', shippingMethodController.getShippingMethods);
router.put('/shippingMethods/:id', shippingMethodController.updateShippingMethod);
router.delete('/shippingMethods/:id', shippingMethodController.deleteShippingMethod);

// Coupon routes
router.post('/addcoupon', addCoupon);
router.get('/coupons', getAllCoupons)
router.post('/validatecoupon', validateCoupon);
router.post('/deactivateCoupon', deactivateCoupon);




module.exports = router;