import React, { useState, useEffect } from 'react';
import './Review.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Ratings = () => {
  const [setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [setSelectedProduct] = useState(null);
  const handelclick2 = () => { navigate('/productReviews') } ;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await axios.get('http://localhost:3001/api/products');

        // Extracting relevant product information
        const formattedProducts = productsResponse.data.response.map(product => ({
          ProductId: product.ProductId,
          ProductName: product.ProductName
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // const openModal = (productId) => {
  //   const product = products.find(prod => prod.ProductId === productId);
  //   if (product) {
  //     setSelectedProduct(product);
  //     setModalOpen(true);
  //   } else {
  //     alert('Product not found');
  //   }
  // };


  return (
    <div className='Review_main'>
      <table className='Reviewtable'>
        <thead>
          <tr>
            <th className='review_theader1'>Product ID</th>
            <th className='review_theader2'>Product Name</th>
            <th className='review_theader3'>View Reviews</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map(product => (
              <tr key={product.ProductID}>
                <td>{product.ProductId}</td>
                <td>{product.ProductName}</td>
                <td>
                  <button className='Review_viewmore' onClick={handelclick2}>Reviews</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No products found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Ratings;
