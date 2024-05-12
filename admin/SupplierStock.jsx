import React, { useState, useEffect } from 'react';
import './SupplierStock.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Neww

function StockForm() {

  const [stocks, setStocks] = useState([]);
  const handleclick6 = () => { navigate('/admin/supplierreg') };

  const [formData, setFormData] = useState({
    StocksupplierName: '',
    supproductId: '',
    supproductnamee:'',
    supstockId: '',
    stockPrice: '',
    supplyDate: '',
    stockquantity: '',
    warehousenameid: '',
    sizes: [],
    colors: []
  });

  
  const [sizeInput, setSizeInput] = useState('');
  const [sizes, setSizes] = useState([]);
  
  
  const [colorInput, setColorInput] = useState('');
  const [colors, setColors] = useState([]);
 
  const warehouseNames = ['WH004', 'WH005', 'WH006'];
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    StocksupplierName: '',
    stockPrice: '',
    stockquantity: '',
    sizeInput: '', 
    colorInput: '' // Add colorInput to errors state
  });


  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/getstock');
      setStocks(response.data.response);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);



  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = '';
    if ((name === 'stockPrice' || name === 'stockquantity') && !(/^\d*\.?\d*$/.test(value))) {
      error = 'Please enter a valid number';
    } else if (name === 'StocksupplierName' && !(/^[a-zA-Z\s]*$/.test(value))) {
      error = 'Please enter only letters';
    }
    setErrors({ ...errors, [name]: error });
    setFormData({ ...formData, [name]: value });
  };

 
  const handleAddSize = () => {
    if (sizeInput.trim() !== '') {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput('');
    }
  };
  
 
  const handleRemoveSize = (index) => {
    const newSizes = [...sizes];
    newSizes.splice(index, 1);
    setSizes(newSizes);
  };

  
  const handleAddColor = () => {
    if (colorInput.trim() !== '') {
      setColors([...colors, colorInput.trim()]);
      setColorInput('');
    }
  };

  
  const handleRemoveColor = (index) => {
    const newColors = [...colors];
    newColors.splice(index, 1);
    setColors(newColors);
  };

  useEffect(() => {
    // Generate supstockId when the component mounts
    const generatedId = Math.random().toString().substr(2, 6);
    setFormData({ ...formData, supstockId: generatedId });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();


// Check if any field is empty
const isAnyFieldEmpty = Object.values(formData).some(value => value === '');

if (isAnyFieldEmpty || sizes.length === 0 || colors.length === 0) {
  toast.error("Please fill in all fields");
  return;
}


  
    try {
      const response = await axios.post('http://localhost:3001/api/addstock', {
        ...formData,
        sizes: sizes, 
        colors: colors 
      });
  
      console.log(response.data); 
      toast.success("Stock data successfully submitted");
      fetchStocks(); // Refetch stock data after successful submission
    
      console.log("Form Data:", formData);
      console.log("Selected Sizes:", sizes);
      console.log("Selected Colors:", colors);

    } catch (error) {
      console.error('Error submitting form:', error);
      
      toast.error("Error submitting stock data");
    }
  
    setFormData({
      StocksupplierName: '',
      supproductId: '',
      supproductnamee:'',
      supstockId: '',
      stockPrice: '',
      supplyDate: '',
      stockquantity: '',
      warehousenameid: '',
      sizes: [], 
      colors: [] 
    });
    setSizeInput(''); 
    setColorInput(''); 
  };

  const generateReport7 = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('SUPPLIER STOCK', 12, 12);
  
    const headers = [
      'Supplier Name',
      'Product ID',
      'Product Name',
      'Stock ID',
      'Stock Price',
      'Supply Date',
      'Quantity',
      'Warehouse Name',
      'Sizes',
      'Colors'
    ];
  
    const data = stocks.map(stock => [
      stock.StocksupplierName,
      stock.supproductId,
      stock.supproductnamee,
      stock.supstockId,
      stock.stockPrice,
      new Date(stock.supplyDate).toLocaleDateString(),
      stock.stockquantity,
      stock.warehousenameid,
      stock.sizes.join(', '),
      stock.colors.join(', ')
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
      theme: 'striped',
      head: [headers],
      body: data,
    };
  
    doc.autoTable(tableProps);
    doc.save('stock_report.pdf');
  };
  

  return (
    <div>
      <div className="newstocksection">NEW STOCK SECTION</div>
      <div className="regpath">Existing Supplier/Supplier Registration/New Stock Section</div>
      <button className="gobackregis-btn" onClick={handleclick6}>Supplier Registration</button>
      <button className="Supstock-btn" onClick={generateReport7}>Generate Report</button> 
      <form onSubmit={handleSubmit} className="supplierstock-form">
        
        <label> Supplier Name: <input type="text" className="StocksupplierName" name="StocksupplierName" value={formData.StocksupplierName} onChange={handleChange}/>{errors.StocksupplierName && <span className="error">{errors.StocksupplierName}</span>}</label><br/>
        <label>Product ID: <input type="text" className="supproductId" name="supproductId" value={formData.supproductId} onChange={handleChange} /></label><br/>
        <label>Product Name: <input type="text" className="supproductnamee" name="supproductnamee" value={formData.supproductnamee} onChange={handleChange} /></label><br/>
        <label>Stock ID: <input type="text" className="supstockId" name="supstockId" value={formData.supstockId} onChange={handleChange} readOnly/></label><br/>
        <label>Stock Price:<input type="text" className="stockPrice" name="stockPrice" value={formData.stockPrice} onChange={handleChange}/>{errors.stockPrice && <span className="error">{errors.stockPrice}</span>}</label><br />
        <label>Supply Date:<input type="date" className="supplyDate" name="supplyDate" value={formData.supplyDate} onChange={handleChange}/></label><br/>

        <label>Sizes:</label>
        <div className='divvvcolor'>
          <div className='sd1'>
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="Enter size"/>

            <button type="button" onClick={handleAddSize}>Add Size</button>
          </div>

          <div className='sd2'>
            {sizes.map((size, index) => (
              <div key={index} className='size-item'>
                <span>{size}</span>
                <button type="button" onClick={() => handleRemoveSize(index)}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <label>Colors:</label>
        <div className='divvvcolor'>
          <div className='sd1'>
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="Enter color name"/>

            <button type="button" onClick={handleAddColor}>Add Color</button>
          </div>

          <div className='sd2'>
            {colors.map((color, index) => (
              <div key={index} className='color-item'>
                <span>{color}</span>
                <button type="button" onClick={() => handleRemoveColor(index)}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <label>Quantity:<input type="number" className="stockquantity" name="stockquantity" value={formData.stockquantity} onChange={handleChange}/>{errors.stockquantity && <span className="error">{errors.stockquantity}</span>}</label><br/>
        <label>Warehouse Name:<select className="warehousenameid" name="warehousenameid" value={formData.warehousenameid} onChange={handleChange}>
            <option value="">Select Warehouse</option>
            {warehouseNames.map((warehouse, index) => (
              <option key={index} value={warehouse}>{warehouse}</option>
            ))}
          </select></label><br/>

        <button type="submit" className="stocksubmit">Submit</button>
      </form>



      <div className="submitted-data">
        <h2 className ="stockTopic">REQUESTED STOCKS</h2>
        <table className="supplierstock-table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Stock ID</th>
              <th>Stock Price</th>
              <th>Supply Date</th>
              <th>Quantity</th>
              <th>Warehouse Name</th>
              <th>Sizes</th>
              <th>Colors</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock._id}>
                <td>{stock.StocksupplierName}</td>
                <td>{stock.supproductId}</td>
                <td>{stock.supproductnamee}</td>
                <td>{stock.supstockId}</td>
                <td>{stock.stockPrice}</td>
                <td>{new Date(stock.supplyDate).toLocaleDateString()}</td>
                <td>{stock.stockquantity}</td>
                <td>{stock.warehousenameid}</td>
                <td>{stock.sizes.join('/')}</td>
                <td>{stock.colors.join('/')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <ToastContainer /> 
    </div>
  );
}

export default StockForm;
