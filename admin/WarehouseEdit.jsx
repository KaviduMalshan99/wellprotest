import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./WarehouseEdit.css";

function WarehouseEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [warehouse, setWarehouse] = useState({
        country: '',
        city: '',
        address: '',
        mail: '',
        telNo: '',
        phoneCode: '',
        phoneMaxLength: 10
    });
    const [emailError, setEmailError] = useState('');

    const countryPhoneDetails = {
        "Sri Lanka": { code: "+94", maxLength: 9 },
        "India": { code: "+91", maxLength: 10 },
        "China": { code: "+86", maxLength: 11 },
        "USA": { code: "+1", maxLength: 10 },
        "UK": { code: "+44", maxLength: 10 }
    };

    useEffect(() => {
        const fetchWarehouseData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/warehouse/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch warehouse details');
                }
                const data = await response.json();
                const details = countryPhoneDetails[data.country] || { code: "", maxLength: 10 };
                setWarehouse({ ...data, phoneCode: details.code, phoneMaxLength: details.maxLength });
            } catch (error) {
                console.error(error);
                alert('Error fetching warehouse data');
                navigate('/admin/warehouse');
            }
        };
        fetchWarehouseData();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'telNo') {
            if (!/^\d*$/.test(value) || value.length > warehouse.phoneMaxLength) {
                return;  // Prevent input if it's not numeric or exceeds the maximum length
            }
        }
        if (name === 'mail') {
            if (!value.includes('@') || value.indexOf('@') === 0) { // Check if '@' exists and if it's not the first character
                setEmailError('Please enter a valid email address');
                return;
            } else {
                setEmailError('');
            }
        }
        if (name === 'country') {
            const details = countryPhoneDetails[value] || { code: "", maxLength: 10 };
            setWarehouse({
                ...warehouse,
                [name]: value,
                phoneCode: details.code,
                phoneMaxLength: details.maxLength,
                telNo: "" // Reset telephone number upon country change
            });
        } else {
            setWarehouse({ ...warehouse, [name]: value });
        }
    };

    const updateWarehouseData = async () => {
        if (emailError) {
            alert('Please correct errors before updating.');
            return;
        }
        try {
            if (warehouse.telNo.length !== warehouse.phoneMaxLength) {
                alert(`Please enter a telephone number with ${warehouse.phoneMaxLength} digits.`);
                return;
            }
            const response = await fetch(`http://localhost:3001/api/updatewarehouse/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(warehouse),
            });
            if (!response.ok) {
                throw new Error('Failed to update warehouse');
            }
            alert('Warehouse updated successfully');
            navigate('/admin/warehouse');
        } catch (error) {
            console.error(error);
            alert('Error updating warehouse');
        }
    };

    const deleteWarehouseData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/deletewarehouse/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete warehouse');
            }
            alert('Warehouse deleted successfully');
            navigate('/admin/warehouse');
        } catch (error) {
            console.error(error);
            alert('Error deleting warehouse');
        }
    };

    return (
        <div className="whadm">
            <div className="whamt">WAREHOUSE SECTION</div>
            <button className="whbbtn" onClick={() => navigate('/admin/warehouse')}>Back</button>
            <div className="whadtxt">Edit Details</div>
            <div className="whmcon">
                <table className="whadf">
                    <tbody>
                        <tr>
                            <td className="whafl">Country</td>
                            <td>
                                <input type="text" className="whainpt" name="country" value={warehouse.country || ''} onChange={handleInputChange} required readOnly />
                            </td>
                        </tr>
                        <tr>
                            <td className="whafl">City</td>
                            <td>
                                <input type="text" className="whainpt" name="city" value={warehouse.city || ''} onChange={handleInputChange} required />
                            </td>
                        </tr>
                        <tr>
                            <td className="whafl">Address</td>
                            <td>
                                <input type="text" className="whainpt" name="address" value={warehouse.address || ''} onChange={handleInputChange} required />
                            </td>
                        </tr>
                        <tr>
                            <td className="whafl">Mail</td>
                            <td>
                                <input type="email" className="whainpt" name="mail" value={warehouse.mail || ''} onChange={handleInputChange} required />
                                {emailError && <span style={{ display: 'block', color: 'red', fontSize: '0.8rem' }}>{emailError}</span>}
                            </td>
                        </tr>
                        <tr>
                            <td className="whafl">Tel No</td>
                            <td>
                                <div className="input-group">
                                    <span className="input-prefix">{warehouse.phoneCode}</span>
                                    <input
                                        type="text"
                                        className="whainptt tel-number"
                                        name="telNo"
                                        value={warehouse.telNo || ''}
                                        onChange={handleInputChange}
                                        maxLength={warehouse.phoneMaxLength}
                                        pattern={`\\d{1,${warehouse.phoneMaxLength}}`}
                                        title={`Please enter up to ${warehouse.phoneMaxLength} numeric characters after the country code`}
                                        required
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="wareeditbtnpnl">
                    <button className='whupbtnn' onClick={updateWarehouseData}>Update</button>
                    <button className="whdelbtn" onClick={deleteWarehouseData}>Delete</button></div>
            </div>
        </div>
    );
}

export default WarehouseEdit;
