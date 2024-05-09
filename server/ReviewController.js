const { error } = require('server/router');
const Review = require('./ReviewModel');
const { response } = require('./app');


const addReview = (req, res, next) => {
    const {ReviewID,ReviewNum,ProductID,CustomerID,Date,CustomerName,CustomerEmail,Ratecount,ReviewTitle,ReviewBody,ReviewImage } = req.body;
   
    const review = new Review({
        ReviewID: ReviewID,
        ReviewNum: ReviewNum,
        ProductID: ProductID,
        Date: Date,
        CustomerID: CustomerID,
        CustomerName: CustomerName,
        CustomerEmail: CustomerEmail,
        Ratecount: Ratecount,
        ReviewTitle: ReviewTitle,
        ReviewBody: ReviewBody,
        ReviewImage: ReviewImage,
    });

    review.save()
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error });
        });
};

const getReview = (req, res, next) => {
    Review.find()
    .then(response => {
        res.json({response});
    })
    .catch(error =>{
        res.json({message:error})
    })
};

const getReviewById = (req, res, next) => {
    const { ReviewID } = req.params;

    Review.findOne({ ReviewID })
        .then(review => {
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }
            res.json({ review });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

const updateReview = (req, res, next) => {
    const ReviewID = req.params.ReviewID;
    const { ReviewTitle, Ratecount , ReviewBody, ReviewImage } = req.body;

    Review.findOneAndUpdate({ ReviewID:ReviewID }, { ReviewTitle, ReviewBody, ReviewImage, Ratecount}, { new: true })
        .then(updatedReview => {
            if (!updatedReview) {
                return res.json({ message: "Review not found" });
            }
            res.json({ updatedReview });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

const deleteReview = (req, res, next) => {
    const { ReviewID } = req.params;

    Review.findOneAndDelete({ ReviewID })
        .then(deletedReview => {
            if (!deletedReview) {
                return res.status(404).json({ message: "Review not found" });
            }
            res.json({ message: "Review deleted successfully" });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};


module.exports = {
    addReview,
    getReview,
    getReviewById,
    updateReview,
    deleteReview,
};
