import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


function WarehouseEdit() {
    const { id } = useParams(); // Grab the ID from the URL
    const navigate = useNavigate(); // For navigation after actions
    const [warehouse, setWarehouse] = useState({
        country: '',
        city: '',
        address: '',
        mail: '',
        telNo: '',
    }); // Initial empty state for the warehouse

    const [emailError, setEmailError] = useState('');

    // Fetch warehouse details on component mount
    useEffect(() => {
        const fetchWarehouseData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/warehouse/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch warehouse details');
                }
                const data = await response.json();
                setWarehouse(data); // Set fetched data to state
            } catch (error) {
                console.error(error);
                alert('Error fetching warehouse data');
                navigate('/warehouse'); // Redirect if there's an error fetching data
            }
        };
        fetchWarehouseData();
    }, [id, navigate]);

    // Handle input change to update state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'telNo' && !/^\d*$/.test(value)) {
            // Only allow numeric characters for telNo field
            return;
        }
        if (name === 'mail' && !value.includes('@')) {
            // Check if email contains '@' symbol
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
            setWarehouse({ ...warehouse, [name]: value });
        }
    };

    // Update warehouse data
    const updateWarehouseData = async () => {

         // Check if there is an email error
    if (emailError) {
        alert('Error updating warehouse');
        return; // Return without updating if there is an email error
    }
        try {
            const response = await fetch(`http://localhost:3001/api/updatewarehouse/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(warehouse),
            });
            if (!response.ok) {
                throw new Error('Failed to update warehouse');
            }
            alert('Warehouse updated successfully');
            navigate('/warehouse'); // Redirect to the warehouse list page
        } catch (error) {
            console.error(error);
            alert('Error updating warehouse');
        }
    };

    // Delete warehouse data
    const deleteWarehouseData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/deletewarehouse/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete warehouse');
            }
            alert('Warehouse deleted successfully');
            navigate('/warehouse'); // Redirect to the warehouse list page
        } catch (error) {
            console.error(error);
            alert('Error deleting warehouse');
        }
    };

    return (
        <div className="whadm">
            <div className="whamt">WAREHOUSE SECTION</div>
            <button className="whbbtn" onClick={() => navigate('/warehouse')}>Go Warehouse Page</button>
            <div className="whadtxt">Edit Details</div>
            <div className="whmcon">
                <table className="whadf">
                    <tbody>
                        <tr>
                            <td className="whafl">Country</td>
                            <td>
                                <input type="text" className="whainpt" name="country" value={warehouse.country || ''} onChange={handleInputChange} required readOnly/>
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
                                {emailError && <span style={{ display: 'flex', fontSize: '12px', paddingLeft: '10px', 
                                color: 'red', marginTop: '-7px' }}>{emailError}</span>}

                            </td>
                        </tr>
                        <tr>
                            <td className="whafl">Tel No</td>
                            <td>
                                <input type="text" className="whainpt" name="telNo" value={warehouse.telNo || ''} onChange={handleInputChange} 
                                pattern="[0-9]*" title="Please enter only numeric characters" required />
                                
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '20px' }}>
                <button className='whupbtnn' onClick={updateWarehouseData}>Update</button>
                <button className="whdelbtn" onClick={deleteWarehouseData}>Delete</button>
            </div>
        </div>
    );
}

export default WarehouseEdit;
