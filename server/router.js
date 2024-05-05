const express = require('express');
const router = express.Router();
const contraller = require('./contraller');
const { route } = require('./app');

const catagoryContraller = require('./CatagoryController');
const customerContraller = require('./CustomerController');
const orderContraller = require('./OrderController');
const productContraller = require('./ProductController'); 
const reviewcontroller = require('./ReviewController');
const faqcontroller = require('./FaqController');

router.get('/users',contraller.getUsers);
router.post('/createuser',contraller.addUser);
router.post('/updateuser',contraller.updateUser);
router.post('/deleteuser',contraller.deleteUser);


//category
router.get('/categories',catagoryContraller.getCategories);
router.post('/addcategories',catagoryContraller.addCategory);
router.post('/deletecategories/:id',catagoryContraller.deleteCategory);
router.post('/updatecategory/:id', catagoryContraller.updateCategory);

//customer
router.get('/customer',customerContraller.getCustomer);
router.post('/addcustomer',customerContraller.addCustomer);
router.post('/updatecustomer',customerContraller.updateCustomer);
router.post('/deletecustomer',customerContraller.deleteCustomer);
router.get('/customer/:userId', customerContraller.getCustomerById);

//order
router.get('/orders',orderContraller.getOrders);
router.post('/addorders',orderContraller.addOrders);
router.post('/updateorders',orderContraller.updateOrder);
router.post('/deleteorders',orderContraller.deleteOrder);

//product
router.get('/products',productContraller.getProducts);
router.get('/products/:productId', productContraller.getProductById);
router.post('/addproduct', productContraller.addProduct);
router.put('/updateproduct/:ProductId', productContraller.updateProduct);
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

module.exports = router;