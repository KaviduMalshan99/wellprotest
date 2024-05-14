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



// const getStock = (req, res, next) => {
//     SupplierStock.find()
//         .then(response => {
//             res.json({ response });
//         })
//         .catch(error => {
//             res.json({ message: error })
//         });
// };

// Controller function to get all SupplierStock data
const getStock = (req, res, next) => {
    SupplierStock.find()
        .then(response => {
            // Ensure response includes all needed fields
            res.json({
                response: response.map(stock => ({
                    supstockId: stock.supstockId,
                    supproductId: stock.supproductId,
                    supproductnamee: stock.supproductnamee,
                    sizes: stock.sizes,
                    colors: stock.colors,
                    stockquantity: stock.stockquantity,
                    warehousenameid: stock.warehousenameid,
                    accepted: stock.accepted  // Make sure this field is being returned
                }))
            });
        })
        .catch(error => {
            console.error("Failed to fetch stocks", error);
            res.status(500).json({ message: "Error fetching stocks", error: error.message });
        });
};

// Controller function to delete SupplierStock data by supstockId
const deleteStockBySupStockId = (req, res, next) => {
    const { supstockId } = req.params;

    console.log(`Deleting stock with supstockId: ${supstockId}`);

    SupplierStock.findOneAndDelete({ supstockId })
        .then(response => {
            if (response) {
                res.json({ message: "Stock deleted successfully", response });
            } else {
                res.status(404).json({ message: `Stock not found with supstockId: ${supstockId}` });
            }
        })
        .catch(error => {
            console.error("Failed to delete stock", error);
            res.status(500).json({ message: "Error deleting stock", error: error.message });
        });
};





// Export the controller function
module.exports = { addSupplierStock, getStock, deleteStockBySupStockId };
