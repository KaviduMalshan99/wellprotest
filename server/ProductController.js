const { response } = require('express');
const Product = require('./ProductModel');

const getProducts = (req, res, next) => {
    Product.find()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({message:error})
        });
};

const addProduct = (req, res, next) => {
    const {
        ProductId,
        ProductName,
        Categories, 
        Price,
        Areas,
        Ratings,
        Sizes,
        Colors,
        ImgUrls,
        Description,
        QuickDeliveryAvailable
    } = req.body;

    
    const product = new Product({
        ProductId: ProductId,
        ProductName: ProductName,
        Categories: Categories,
        Price: Price,
        Areas:Areas,
        Ratings: Ratings,
        Sizes: Sizes,
        Colors: Colors,
        ImgUrls: ImgUrls,
        Description:Description,
        QuickDeliveryAvailable: QuickDeliveryAvailable
    });

    // Save the product to the database
    product.save()
        .then(response =>{
            res.json({response});
        })
        .catch(error=> {
            res.json({error});
        });
};

const updateProduct = (req, res, next) => {
    const { ProductId,ProductName,Categories,Price,Areas,Ratings,Sizes,Colors,ImgUrls,Description,QuickDeliveryAvailable } = req.body;

    Product.findOneAndUpdate(
        { ProductId: req.params.ProductId }, // Corrected here
        { $set: { ProductName, Categories, Price, Areas, Ratings, Sizes, Colors, ImgUrls, Description, QuickDeliveryAvailable } },
        { new: true }
    )
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};  



const deleteProduct = (req, res, next) => {
    const ProductId = req.params.ProductId;

    Product.deleteOne({
        ProductId: ProductId
    })
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};

const getProductById = (req, res, next) => {
    const productId = req.params.productId;

    Product.findOne({ ProductId: productId })
        .then(product => {
            if (!product) {
                return res.json({ message: 'Product not found' });
            }
            res.json({ product });
        })
        .catch(error => {
            res.json({ error: error.message });
        });
};
module.exports = { getProducts, addProduct, updateProduct, deleteProduct,getProductById };
