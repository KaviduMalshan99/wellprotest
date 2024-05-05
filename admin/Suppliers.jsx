import React, { useState, useEffect } from 'react';
import './Suppliers.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'jspdf-autotable';
import jsPDF from 'jspdf';

function Suppliers() {
  
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedSupplier, setEditedSupplier] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);           // State variable to control confirmation dialog
  const [supplierToDelete, setSupplierToDelete] = useState(null); // State variable to store details of supplier to delete
  const navigate = useNavigate();
  const handleclick7 = () => { navigate('/supplierEmail') };

  useEffect(() => {
    axios.get('http://localhost:3001/api/suppliers')
      .then(response => {
        setSuppliers(response.data.response);
      })
      .catch(error => {
        console.error('Error fetching suppliers:', error);
      });
  }, []);

  const handleViewClick = (userId) => {
    navigate(`/supplierdetails/${userId}`);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (index, supplier) => {
    setEditMode(index);
    // Set editedSupplier to the current supplier being edited
    setEditedSupplier({ ...supplier });
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedSupplier({});
  };

  const updateSupplier = (id) => {
    axios.put(`http://localhost:3001/api/suppliers/${id}`, editedSupplier)
      .then(response => {
        const updatedSuppliers = [...suppliers];
        updatedSuppliers[editMode] = response.data; 
        setSuppliers(updatedSuppliers);
        setEditMode(null);
        // Reset editedSupplier state
        setEditedSupplier({});
        toast.success('Supplier updated successfully');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating supplier:', error);
        toast.error('Failed to update supplier');
      });
  };

  const handleDelete = (supplier) => {
    setSupplierToDelete(supplier);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:3001/api/suppliers/${supplierToDelete._id}`)
      .then(response => {
        const updatedSuppliers = suppliers.filter(supplier => supplier._id !== supplierToDelete._id);
        setSuppliers(updatedSuppliers);
        toast.success('Supplier deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting supplier:', error);
        toast.error('Failed to delete supplier');
      })
      .finally(() => {
        // Close the confirmation dialog
        setShowConfirm(false);
      });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update editedSupplier state as user types in the input fields
    setEditedSupplier(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    return supplier &&
      supplier.fullName && supplier.supplyproduct &&
      (supplier.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || supplier.supplyproduct.toLowerCase().includes(searchTerm.toLowerCase()));
  });
  


  const generateReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('SUPPLIER REPORT', 12, 12);
  
    // Define table headers
    const headers = [
      'Supplier Name',
      'Email Address',
      'Contact',
      'NIC',
      'Supply Prodcut',
      'City',
      'Country',
      'Warehouse'
    ];
  
    // Define table data
    const data = filteredSuppliers.map(supplier => [
      supplier.fullName,
      supplier.email,
      supplier.contactNumber,
      supplier.nic,
      supplier.supplyproduct,
      supplier.city,
      supplier.country,
      supplier.nearestWarehouse
    ]);
  
    const tableProps = {
      startY: 20,
      margin: { top: 20 },
      styles: {
        cellPadding: 0.5,
        fontSize: 10,
        valign: 'middle',
        halign: 'center',
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: { 0: {cellWidth:27}, 1: {cellWidth:34}, 2: {cellWidth:24}, 3: {cellWidth:25}, 4: {cellWidth:25}, 5: {cellWidth:18}, 6: {cellWidth:18}, 7: {cellWidth:20}},
      theme: 'striped',
      head: [headers],
      body: data,
    };
  
    doc.autoTable(tableProps);
    doc.save('supplier_report.pdf');
  };

  return (
    <div className="STbWi">
      <div className="supheadtxt">SUPPLIERS SECTION</div>
      <button className="supregister-btnsup" onClick={() => navigate('/supplierreg')}> + Add New Supplier</button>
      <button className="Supreport" onClick={generateReport}>Generate Report</button>
      <button className="Supemail-btn" onClick={handleclick7}>Email Section</button> 
      <input type="text" className="search-bar" placeholder="Search Supplier" value={searchTerm} onChange={handleSearchTermChange} />
      <table className="supplier-table">
        <thead>
          <tr>
            <th className="Titlehead">SUPPLIER NAME</th>
            <th className="Titlehead">EMAIL ADDRESS</th>
            <th className="Titlehead">CONTACT</th>
            <th className="Titlehead">NIC</th>
            <th className="Titlehead">SUPPLY ITEM</th>
            <th className="Titlehead">CITY</th>
            <th className="Titlehead">COUNTRY</th>
            <th className="Titlehead">WAREHOUSE</th>
            <th className="Titlehead">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers.map((supplier, index) => (
            <tr key={index}>
              <td className="data">{editMode === index ? <input type="text" className="valueinputfield" name="fullName" value={editedSupplier.fullName || ''} onChange={handleChange} /> : supplier.fullName}</td>
              <td className="data">{editMode === index ? <input type="text" className="valueemail" name="email" value={editedSupplier.email || ''} onChange={handleChange} /> : supplier.email}</td>
              <td className="data">{editMode === index ? <input type="text" className="valueinputfield" name="contactNumber" value={editedSupplier.contactNumber || ''} onChange={handleChange} /> : supplier.contactNumber}</td>
              <td className="data">{editMode === index ? <input type="text" className="valueinputfield" name="nic" value={editedSupplier.nic || ''} onChange={handleChange} /> : supplier.nic}</td>
              <td className="data">
                {editMode === index ? (
                  <select
                    className="valueselect"
                    name="supplyproduct"
                    value={editedSupplier.supplyproduct || ''}
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
                ) : (
                  supplier.supplyproduct
                )}
              </td>
              <td className="data">{editMode === index ? <input type="text" className="valuecityy" name="city" value={editedSupplier.city || ''} onChange={handleChange} /> : supplier.city}</td>
              <td className="data">{editMode === index ? <input type="text" className="valuecitcouwar" name="country" value={editedSupplier.country || ''} onChange={handleChange} /> : supplier.country}</td>
              <td className="data">{editMode === index ? <input type="text" className="valuecitcouwar" name="nearestWarehouse" value={editedSupplier.nearestWarehouse || ''} onChange={handleChange} /> : supplier.nearestWarehouse}</td>
              <td className="data">
                <div className="supbtnmcon">
                  {editMode === index ?
                    <>
                      <button className="view-more-save" onClick={() => updateSupplier(supplier._id)}>Save</button>
                      <button className="view-more-cancel" onClick={handleCancelEdit}>Cancel</button>
                    </>
                    :
                    <>
                      <button className="view-more-update" onClick={() => handleEdit(index, supplier)}>Update</button>
                      <button className="view-more-delete" onClick={() => handleDelete(supplier)}>Delete</button> {/* Pass supplier object to handleDelete */}
                    </>
                  }
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showConfirm && (
        <div className="confirm-dialog">
          <p>Are you sure you want to delete this supplier?</p>
          <center><div>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={() => setShowConfirm(false)}>No</button>
          </div></center>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Suppliers;
