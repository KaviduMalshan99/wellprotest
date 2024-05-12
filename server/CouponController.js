// CouponController.js
const Coupon = require('./CouponModel');

const addCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).send(coupon);
    } catch (error) {
        res.status(400).send(error);
    }
};

const validateCoupon = async (req, res) => {
    const { code, country } = req.body;
    try {
        const coupon = await Coupon.findOne({ code, country, isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found or not valid for your country." });
        }
        await deactivateCoupon({ code }); // Assuming deactivateCoupon accepts an object with code
        res.json(coupon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// New method to deactivate the coupon once the order is successfully placed
const deactivateCoupon = async ({ code }) => {
    try {
        const coupon = await Coupon.findOneAndUpdate({ code }, { isActive: false }, { new: true });
        if (!coupon) {
            return { success: false, message: "Coupon not found." };
        }
        return { success: true, coupon };
    } catch (error) {
        return { success: false, error: error.message };
    }
};


const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch coupons' });
    }
};

module.exports = { addCoupon, validateCoupon, getAllCoupons, deactivateCoupon};
