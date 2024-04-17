const Orders = require ('./OrdersModel');

const getOrders = (req,res,next)=>{
    Orders.find()
    .then(response => {
        res.json({response});
    })
    .catch(error => {
        res.json({message: error});
    });
};

const addOrders = (req,res,next) =>{
    const {
        OderId,
        UserId,
        catagory,
        ProductsIds,
        ProductNames,
        Count,
        TotalPrice,
    }=req.body;

    const order = new Orders({
        OderId:OderId,
        UserId:UserId,
        catagory:catagory,
        ProductsIds:ProductsIds,
        ProductNames:ProductNames,
        Count:Count,
        TotalPrice:TotalPrice,

    });

    order.save()

    customer.save()
    .then(response => {
        res.json({response});
    })
    .catch(error => {
        res.json({error});
    });
};

const updateOrder = (req,res,next) => {
    const UserId = req.params.UserId;
    const {ProductsIds,Count,TotalPrice}=req.body;
    

    Orders.findOneAndUpdate(
        {UserId:UserId},
        {$set:{ProductsIds:ProductsIds,Count:Count,TotalPrice:TotalPrice}},
        {new:true}
    )
    .then(response => {
        res.json({response});
    })
    .catch(error => {
        res.json({error});
    });
};

const deleteOrder = (req,res,next) =>{
    const OrderId = req.params.OrderId;

    Orders.deleteOne({OrderId:OrderId})
    .then(response => {
        res.json({response});
    })
    .catch(error => {
        res.json({error});
    });
}

module.exports = {getOrders,addOrders,updateOrder,deleteOrder};
