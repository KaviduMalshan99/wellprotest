import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './shipping.scss';


function ShippingMethodManager() {
    const [methods, setMethods] = useState([]);
    const [methodName, setMethodName] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        fetchMethods();
    }, []);

    const fetchMethods = async () => {
        const { data } = await axios.get('http://localhost:3001/api/shippingMethods');
        setMethods(data);
    };

    const handleAdd = async () => {
        await axios.post('http://localhost:3001/api/shippingMethods', { methodName, price });
        fetchMethods();
        setMethodName('');
        setPrice('');
    };

    const handleUpdate = async (id) => {
        await axios.put(`http://localhost:3001/api/shippingMethods/${id}`, { methodName, price });
        fetchMethods();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:3001/api/shippingMethods/${id}`);
        fetchMethods();
    };

    return (
        <div className="shipping-method-manager">
            <input type="text" placeholder="Method Name" value={methodName} onChange={e => setMethodName(e.target.value)} />
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(parseFloat(e.target.value))} />
            <button onClick={handleAdd}>Add New Shipping Method</button>
            <ul>
                {methods.map(method => (
                    <li key={method._id}>
                        {method.methodName} - LKR {method.price}
                        <button onClick={() => handleUpdate(method._id)}>Edit</button>
                        <button onClick={() => handleDelete(method._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ShippingMethodManager;
