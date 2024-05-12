const SupplierStock = require("./SupplierStockModel");
const express = require('express');
const router = express.Router();

// Controller function to add SupplierStock data
const addSupplierStock = (req, res, next) => {
    const {
        StocksupplierName,
        supproductId,
        supproductnamee,
        supstockId,
        stockPrice,
        supplyDate,
        stockquantity,
        warehousenameid,
        sizes,
        colors
    } = req.body;

    const supplierStock = new SupplierStock({
        StocksupplierName,
        supproductId,
        supproductnamee,
        supstockId,
        stockPrice,
        supplyDate,
        stockquantity,
        warehousenameid,
        sizes,
        colors
    });

    supplierStock.save()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};



const getStock = (req,res, next)=>{
    SupplierStock.find()
    .then(response =>{
        res.json({response});
    })
    .catch(error => {
        res.json({message:error})
    });
};





// Export the controller function
module.exports = {addSupplierStock,getStock};
