import { useState } from 'react';
import './SupplierReg.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function SupplierReg() {
    const navigate = useNavigate();
    const handleclick2 = () => { navigate('/admin/supplier') }; 
    const handleclick4 = () => { navigate('/admin/supplierstock') }; 

    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        email: '',
        contactNumber: '',
        nic: '',
        supplyproduct: '',
        city: '',
        country: '',
        nearestWarehouse: ''
    });
    
    const [inputErrors, setInputErrors] = useState({
        fullName: false,
        companyName: false,
        email: false,
        contactNumber: false,
        nic: false,
        supplyproduct: false,
        city: false,
        country: false,
        nearestWarehouse: false
    });

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        let newValue = value;
        let error = false;
    
        if (id === 'fullName' || id === 'country' || id === 'city' || id === 'companyName') {
            
            if (!/^[A-Za-z\s]+$/.test(value)) {
                error = true;
            }
        } else if (id === 'contactNumber') {
            
            if (!/^\d+$/.test(value)) {
                error = true;
            }
        } else if (id === 'nearestWarehouse') {
          
            newValue = value;
        } else {
            newValue = type === 'checkbox' ? checked : value;
        }
    
        setFormData(prevState => ({
            ...prevState,
            [id]: newValue
        }));
        
        setInputErrors(prevErrors => ({
            ...prevErrors,
            [id]: error
        }));
    
        
        
        if (!error) {
            setInputErrors(prevErrors => ({
                ...prevErrors,
                [id]: false
            }));
        }
    };

    
    const handleSubmit = async () => {
        // Check if any input field (except company name) has an error or is empty
        const hasError = Object.keys(inputErrors).filter(field => field !== 'companyName').some(field => inputErrors[field]) || 
        Object.keys(formData).filter(field => field !== 'companyName').some(field => !formData[field].trim());

        if (hasError) {
            toast.error("Please fill all fields with valid input.");
            return;
        }
        try {
            const response = await axios.post('http://localhost:3001/api/addsupplier', formData);
            if (response.status === 200) {
                setFormData({
                    fullName: '',
                    companyName: '',
                    email: '',
                    contactNumber: '',
                    nic: '',
                    supplyproduct: '',
                    city: '',
                    country: '',
                    nearestWarehouse: ''
                });

                toast.success("Supplier registration is successful!");
            } else {
                throw new Error("Submission failed. Please try again later.");
            }
        } catch (error) {
            toast.error("Submission failed. Please try again later.");
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div>
            <div className="regmh">SUPPLIER REGISTRATION</div>
            <div className="regpath">Existing Suppliers / Supplier Registration</div>
            <button className="goback-btn" onClick={handleclick2}>Go back to Suppliers</button>
            <button className="goback-btn2" onClick={handleclick4}>+ Add Stock</button>
            <form className="formregis">
            <center>
                <div className="regmconn">
                    <div className="rgfcon">
                        <div className="regf">
                            <div className="supdetails">REGISTRATION</div><br/>
                            <table className="table10">
                                <tbody>
                                    <tr>
                                        <td colSpan="2">
                                            <input 
                                                type="text" 
                                                className="reginp2" 
                                                name="firstName" 
                                                id="fullName" 
                                                value={formData.fullName} 
                                                onChange={handleChange} 
                                                placeholder="FULL NAME:"
                                            />
                                            {inputErrors.fullName && <span className="error-messagesup">*Only letters are allowed</span>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <input 
                                                type="text" 
                                                className="reginp" 
                                                name="companyName" 
                                                id="companyName" 
                                                value={formData.companyName} 
                                                onChange={handleChange} 
                                                placeholder="COMPANY NAME:"
                                            />
                                            {inputErrors.companyName && <span className="error-messagesup">*Only letters are allowed.</span>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <input 
                                                type="text" 
                                                className="reginp3" 
                                                name="email" 
                                                id="email" 
                                                value={formData.email} 
                                                onChange={handleChange} 
                                                placeholder="EMAIL ADDRESS:"
                                            />
                                
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input 
                                                type="text" 
                                                className="reginp2" 
                                                maxLength="10" 
                                                name="contactNumber" 
                                                id="contactNumber" 
                                                value={formData.contactNumber} 
                                                onChange={handleChange} 
                                                placeholder="CONTACT NUMBER:"
                                            />
                                            {inputErrors.contactNumber && <span className="error-messagesup">*Enter only digits.</span>}
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
                                                className="reginpnic" 
                                                name="nic" 
                                                id="nic" 
                                                value={formData.nic} 
                                                onChange={handleChange} 
                                                placeholder="NIC:"
                                            />
                                            {inputErrors.nic && <span className="error-messagesup">*Enter a valid NIC.</span>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <select 
                                                className="reginp" 
                                                name="supplyproduct" 
                                                id="supplyproduct" 
                                                value={formData.supplyproduct} 
                                                onChange={handleChange} 
                                            >
                                                <option value="">Select Supply Product</option>
                                                <option value="Mens Bags">Mens Bags</option>
                                                <option value="Mens Shoes">Mens Shoes</option>
                                                <option value="Mens Bags & Shoes">Mens Bags & Shoes</option>
                                                <option value="Women Bags">Women Bags</option>
                                                <option value="Women Shoes">Women Shoes</option>
                                                <option value="Women Bags & Shoes">Women Bags & Shoes</option>
                                                <option value="Mens & Women Bags & Shoes">Mens & Women Bags & Shoes</option>
                                            </select>
                                            {inputErrors.supplyproduct && <span className="error-messagesup">*Please select a supply product.</span>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <input 
                                                type="text" 
                                                className="reginp2" 
                                                name="city" 
                                                id="city" 
                                                value={formData.city} 
                                                onChange={handleChange} 
                                                placeholder="CITY:"
                                            />
                                            {inputErrors.city && <span className="error-messagesup">*Only letters are allowed.</span>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <input 
                                                type="text" 
                                                className="reginp2" 
                                                name="country" 
                                                id="country" 
                                                value={formData.country} 
                                                onChange={handleChange} 
                                                placeholder="COUNTRY:"
                                            />
                                            {inputErrors.country && <span className="error-messagesup">*Only letters are allowed.</span>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <div className="reginpcheckt3">Select Nearest Warehouse :</div>
                                            <div className="reginp5">
                                                <select 
                                                    className="drop1" 
                                                    name="nearestWarehouse" 
                                                    id="nearestWarehouse" 
                                                    value={formData.nearestWarehouse} 
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Nearest Warehouse</option>
                                                    <option value="USA">USA</option>
                                                    <option value="China">China</option>
                                                    <option value="Sri Lanka">Sri Lanka</option>
                                                </select>
                                                {inputErrors.nearestWarehouse && <span className="error-messagesup">*Please select nearest warehouse.</span>}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <center><button className="regbtn" onClick={handleSubmit}>REGISTER NOW</button></center>
                        </div>
                    </div>
                </div>
            </center>
            </form>
            <ToastContainer />
        </div>
    );
}

export default SupplierReg;
