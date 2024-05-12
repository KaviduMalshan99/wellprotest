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
const RefundController = require('./RefundController');
const SupplierRegController = require('./SupplierRegController');
const SupplierStockController = require('./SupplierStockController');
const dispatchedOrderController = require('./DispatchedOrdersController')

const CurrentStockController = require('./CurrentStockController');
const {
  createOrUpdateNotification,
  getNotifications,
} = require('./NotificationController');


const AcceptedStockController = require('./AcceptedStockController');
// const OrdersTableController = require('./OrdersTableController');
const {
    getWarehouse,
    getAllWarehouses,
    addWarehouse,
    getWarehouseById,
    updateWarehouse,
    deleteWarehouse,
    getNextId
  } = require('./WarehouseController');


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
router.post('/addorders',orderContraller.addOrder);
router.post('/updateorders',orderContraller.updateOrder);
router.post('/deleteorders',orderContraller.deleteOrder);
router.post('/orders/sendemail', orderContraller.sendOrderStatusEmail);
router.put("/updatestatus", orderContraller.updateOrderStatus);
router.put("/updateContactStatus/:orderId", orderContraller.updateContactStatus);

//product
router.get('/products',productContraller.getProducts);
router.get('/products/:productId', productContraller.getProductById);
router.post('/addproduct', productContraller.addProduct);
router.put('/updateproduct/:productId', productContraller.updateProduct);
router.delete('/deleteproduct/:ProductId',productContraller.deleteProduct);


//review
router.get('/reviews',reviewcontroller.getReview);
router.post('/addreviews',reviewcontroller.addReview);
router.post('/updatereview',reviewcontroller.updateReview);
router.delete('/deletereview',reviewcontroller.deleteReview);

//faq
router.get('/faqs',faqcontroller.getFaq);
router.post('/addfaqs',faqcontroller.addFaq);

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
router.delete('/supplierstock/:supstockId', SupplierStockController.deleteStockBySupStockId);

//Warehouse
// router.get("/oders", OrdersTableController.getOrdersTable);
// router.post("/addorder", OrdersTableController.addOrdersTable);
// router.put("/updateorder", OrdersTableController.updateOrdersTable);
// router.delete("/deleteorder", OrdersTableController.deleteOrdersTable);
// router.post('/orders/sendemail', OrdersTableController.sendOrderStatusEmail);
// router.put("/updatestatus", OrdersTableController.updateOrdersTableStatus);
// router.put("/updateContactStatus/:orderId", OrdersTableController.updateContactStatus);

// Routes for warehouse operations
router.get('/warehouse', getAllWarehouses);
router.post('/addwarehouse', addWarehouse);
router.get('/warehouse/:id', getWarehouse, getWarehouseById);
router.patch('/updatewarehouse/:id', getWarehouse, updateWarehouse);
router.delete('/deletewarehouse/:id', getWarehouse, deleteWarehouse);
router.get('/nextId', getNextId);



router.get('/stocks/:warehouseId', CurrentStockController.getStockByWarehouseId);
router.post('/stocks', CurrentStockController.createProductStock);
router.put('/stocks/:id', CurrentStockController.updateProductStock);
router.delete('/stocks/:id', CurrentStockController.deleteProductStock);
router.get('/stocks', CurrentStockController.getAllProductStocks);
router.put('/dispatchOrder', CurrentStockController.dispatchOrder);


router.post('/acceptstock/:id', CurrentStockController.acceptAndModifyStock);

// Route to fetch all accepted stocks
router.get('/acceptedstocks', AcceptedStockController.getAcceptedStocks);

//Notifications Inventory

router.post('/notifications', createOrUpdateNotification);
router.get('/notifications', getNotifications);

// Route to create a dispatched order
router.post('/dispatchedOrders', dispatchedOrderController.createDispatchedOrder);
router.post('/adjustStockQuantities', CurrentStockController.adjustStockQuantities);

router.delete('/dispatchedOrders', dispatchedOrderController.deleteAllDispatchedOrders);

module.exports = router;