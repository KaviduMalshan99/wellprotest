import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './coupon.scss'; 

function AdminDashboard() {
    const [couponData, setCouponData] = useState({
        code: '',
        discountType: '',
        discountValue: '',
        country: '',
        currency: ''
    });
    const [coupons, setCoupons] = useState([]);
    const [filter, setFilter] = useState({ country: '', isActive: '' });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/coupons');
            setCoupons(response.data);
        } catch (error) {
            console.error('Failed to fetch coupons', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updates = { [name]: value };
        if (name === 'country') {
            const currencyMap = { 'Sri Lanka': 'LKR', 'USA': 'USD', 'India': 'USD' };
            updates.currency = currencyMap[value];
        }
        setCouponData(prev => ({ ...prev, ...updates }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/addcoupon', couponData);
            setCoupons([...coupons, response.data]);
            setCouponData({ code: '', discountType: '', discountValue: '', country: '', currency: '' });
        } catch (error) {
            alert('Failed to add coupon');
        }
    };

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredCoupons = coupons.filter(coupon =>
        ((searchQuery === '') ||
        (coupon.code.toLowerCase() === searchQuery.toLowerCase())) &&
        (filter.country === '' || coupon.country === filter.country) &&
        (filter.isActive === '' || coupon.isActive.toString() === filter.isActive));
    
    return (
        <div className="dashboard-container">
            <h1 className="header">Coupon Code</h1>
            <form className="form-container" onSubmit={handleSubmit}>
                <input className="input-field" name="code" value={couponData.code} placeholder="Coupon Code" onChange={handleInputChange} />
                <select className="input-field" name="discountType" value={couponData.discountType} onChange={handleInputChange}>
                    <option value="">Select Discount Type</option>
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="NUMBER">Fixed Amount</option>
                </select>
                <input className="input-field" name="discountValue" value={couponData.discountValue} placeholder="Discount Value" onChange={handleInputChange} />
                <select className="input-field" name="country" value={couponData.country} onChange={handleInputChange}>
                    <option value="">Select Country</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="USA">USA</option>
                    <option value="India">India</option>
                </select>
                <input className="input-field" name="currency" value={couponData.currency} placeholder="Currency" onChange={handleInputChange} disabled />
                <button className="submit-button">Add Coupon</button>
            </form>
            <input
                className="input-field"
                type="text"
                placeholder="Search by code..."
                value={searchQuery}
                onChange={handleSearch}
            />
            <div className="filter-container">
                <select className="input-field" name="country" value={filter.country} onChange={handleFilterChange}>
                    <option value="">Filter by Country</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="USA">USA</option>
                    <option value="India">India</option>
                </select>
                <select className="input-field" name="isActive" value={filter.isActive} onChange={handleFilterChange}>
                    <option value="">Filter by Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>
            <table className="coupon-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Country</th>
                        <th>Currency</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCoupons.map((coupon, index) => (
                        <tr key={index}>
                            <td>{coupon.code}</td>
                            <td>{coupon.discountType}</td>
                            <td>{coupon.discountValue}</td>
                            <td>{coupon.country}</td>
                            <td>{coupon.currency}</td>
                            <td>{coupon.isActive ? 'Active' : 'Inactive'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;
