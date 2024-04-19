import { useState,useEffect } from 'react';
import './Product.css';
import axios from 'axios';
import AddProductModel from '../admin/AddProductModel';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditProductModal from '../admin/EditProductModal';
import { Modal } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const Product = () => {

  
  const [products, setProducts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]); // State to hold filtered products
  const [searchTerm, setSearchTerm] = useState(''); // State to hold search term

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products');
      setProducts(response.data.response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    
    fetchProducts();
    const intervalId = setInterval(fetchProducts, 5000);
    return () => clearInterval(intervalId);
  }, []);

  

  const toggleEditModal = (productId) => {
    setIsEditModalOpen(!isEditModalOpen);
    const product = products.find(product => product.ProductId === productId);
    setSelectedProduct(product);
  };

  const toggleAddModal = () => {
    setIsAddModalOpen(!isAddModalOpen);
    
  };

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(product => {
      return product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             product.ProductId.toString().includes(searchTerm.toLowerCase());
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3001/api/deleteproduct/${productId}`);
      setProducts(products.filter(product => product.ProductId !== productId));
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product.');
    }
  };

  
  const generateReport = () => {
    const doc = new jsPDF();
  
    // Define table headers
    const headers = ['ID', 'Product Name', 'Price'];
  
    // Define table data
    const data = filteredProducts.map(product => [
      product.ProductId,
      product.ProductName,
      product.Price
    ]);
  
    // Set table styles
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
  
    // Add table to the document
    doc.autoTable(tableProps);
  
    // Save the PDF
    doc.save('product_report.pdf');
  };
  
  

  

  return (
    <div className='ProductContainer'>

      <h1 className='PRODUCTTITLE'>Products Section</h1>


      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Category..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="search-button">
          <i className="fas fa-search" />
        </button>
      </div>
      
      <div className="addProductSection" > 
      <button className='PRODUCTGenarate' onClick={generateReport}>Generate Report</button>


        <button type='button' className='PRODUCTADDPRO' onClick={toggleAddModal}>
          <i className="fas fa-plus"></i>Add Products
        </button>
        <Modal open={isAddModalOpen} onClose={toggleAddModal} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{justifyContent:'center', width: '80%', maxWidth: '1000px', borderRadius:'10px',maxHeight: '85vh', overflowY: 'auto', backgroundColor: '#cfd2d2', padding: '20px',  }}>
            <AddProductModel onClose={toggleAddModal} />
          </div>
        </Modal>

      </div>

    

      <div className="product-count">
        <p>Total Products: ({filteredProducts.length})</p>
      </div>

      <div className="product-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.ProductId}>
                <td>{product.ProductId}</td>
                <td>
                  {product.ImgUrls && product.ImgUrls.length > 0 ? (
                      <img
                        src={product.ImgUrls[0]}
                        alt={product.ProductName}
                        onLoad={() => console.log('Image loaded successfully')}
                        onError={(e) => { e.target.src = 'placeholder-image-url'; }} 
                      />
                    ) : (
                      <div>No Image</div>
                    )}
                </td>
                <td>{product.ProductName}</td>
                <td>{product.Price}</td>
                <td>
                  <button className="edit-btn" onClick={() => toggleEditModal(product.ProductId)}>Edit</button>
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(product.ProductId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <Modal open={isEditModalOpen} onClose={toggleEditModal} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{justifyContent:'center', width: '80%', maxWidth: '1000px', borderRadius:'10px',maxHeight: '85vh', overflowY: 'auto', backgroundColor: '#cfd2d2', padding: '20px',  }}>
            <EditProductModal closeModal={toggleEditModal} product={selectedProduct} />
          </div>
        </Modal>
      )}

      <ToastContainer/>
    </div>
  )
}

export default Product