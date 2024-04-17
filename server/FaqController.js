const Faq = require('./FaqModel');

const addFaq = (req, res, next) => {
    const { FaqID,CustomerName,CustomerEmail,Question } = req.body;

    const faq = new Faq ({
        FaqID: FaqID,
        CustomerName: CustomerName,
        CustomerEmail: CustomerEmail,
        Question: Question,
    })

    faq.save()
        .then(response => {
            res.json({response})
        })
        .catch(error => {
            res.json({error})
        });
};

const getFaq = (req, res, next) => {
    const { FaqID } = req.params;

    Faq.findOne({ FaqID })
        .then(faq => {
            if (!faq) {
                return res.status(404).json({ message: "FAQ not found" });
            }
            res.json({ faq });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

module.exports = {
    addFaq,
    getFaq
};
