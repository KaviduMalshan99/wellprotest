import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Product.css';
import { Link } from 'react-router-dom';

const Product = () => {
  const { id } = useParams(); // Get the 'id' from URL params
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {

    console.log(id);
    const fetchProductById = async (productId) => {
      try {
        const response = await axios.get(`http://localhost:3001/api/products/${productId}`);
        const productData = response.data.product;

        if (!productData || typeof productData !== 'object' || !('ProductId' in productData)) {
          throw new Error('Invalid product data received from the server');
        }

        setProduct(productData); // Update the state with fetched product data
        console.log('Product Details:', productData); // Log product details to console
      } catch (error) {
        console.error('Error fetching product:', error);
        // Handle the error as needed, e.g., display an error message
      }
    };

    fetchProductById(id); // Fetch product data when 'id' changes
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    // Implement your addToCart logic here
    navigate('/cart');
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  // Render product details once loaded
  return (
    <div>
      
      <p className='main1'><Link to='/'>HOME</Link>  <i className="fas fa-angle-right" /> <Link to="/men">MEN  </Link><i className="fas fa-angle-right" />  <Link to="/product/:id">{product.ProductName} </Link></p>

      <div className="product-container">
        
        
        {/* Left Section */}
        <div className="left-section">
          <div className="main-image">
            <img src={selectedImage || product.ImgUrls[0]} alt={product.ProductName} />
          </div>
          {Array.isArray(product.ImgUrls) && (
            <div className="small-images">
              {product.ImgUrls.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={product.ProductName}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          )}
        </div>


        {/* Right Section */}
        <div className="right-section">
          <p className='product_title'>{product.ProductName}</p>
          <div className="ratings1">
            <div className="stars1">
              {/* Render stars based on product rating */}
              {/* Example: Assuming product.rating contains the rating value */}
              {Array.from({ length: product.rating }, (_, index) => (
                <i key={index} className="fas fa-star"></i>
              ))}
              {/* Render half star if rating is not an integer */}
              {product.rating % 1 !== 0 && <i className="fas fa-star-half"></i>}
            </div>
            <span>({product.reviews} Reviews)</span>
          </div>
          <div className="price1">{product.price}</div>



          {/* Size Selector (Add your sizes here) */}
          <label>Select Size: {selectedSize && <span>({selectedSize})</span>}</label>
          <div className="sizebutton">
            <button
              className={selectedSize === 'S' ? 'selected' : ''}
              onClick={() => handleSizeSelect('S')}
            >
              S
            </button>
            <button
              className={selectedSize === 'M' ? 'selected' : ''}
              onClick={() => handleSizeSelect('M')}
            >
              M
            </button>
            <button
              className={selectedSize === 'L' ? 'selected' : ''}
              onClick={() => handleSizeSelect('L')}
            >
              L
            </button>
            <button
              className={selectedSize === 'XL' ? 'selected' : ''}
              onClick={() => handleSizeSelect('XL')}
            >
              XL
            </button>
          </div>

          {/* Quantity */}
          <label>Quantity:</label>
          <div className="quantity-selector">
            <button onClick={decrementQuantity}>-</button>
            <span>{quantity}</span>
            <button onClick={incrementQuantity}>+</button>
          </div>

          <div className="abs">
            {/* Add to Cart Button */}
            <div className="addcart">
              <button onClick={handleAddToCart}>Add to Cart</button>
            </div>

            {/* Buy Now Button */}
            <div className="buyNow">
              <button>Buy Now</button>
            </div>
          </div>

          

        </div>
      </div>

    </div>
  );
};

export default Product;
