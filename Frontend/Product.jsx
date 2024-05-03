import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Product.css';
import { Link } from 'react-router-dom';
import Footer from './Footer/Footer';
import Header from './Header/Header';

const Product = () => {
  const { id } = useParams(); // Get the 'id' from URL params
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [availableColors, setAvailableColors] = useState([]);
  const [originalPrice, setOriginalPrice] = useState(null);

  useEffect(() => {
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

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    const colors = product.Variations
      .filter(variation => variation.size === size)
      .map(variation => variation.color);
    setAvailableColors(colors);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
    const selectedVariation = product.Variations.find(variation => variation.name === color);
    if (selectedVariation) {
      setSelectedImage(selectedVariation.images);
      setProduct(prevProduct => ({
        ...prevProduct,
        Price: selectedVariation.price // Update the price to the variation's price
      }));
      
    } else {
      // If no variation is found, revert to the original price
      setProduct(prevProduct => ({
        ...prevProduct,
        Price: originalPrice // Update the price to the original price
      }));
    }
  };
  
  
  



  if (!product) {
    return <div>Loading...</div>;
  }

  const handleBuyNow = () => {
    const checkoutUrl = `/checkout?id=${id}&quantity=${quantity}&size=${selectedSize}&color=${selectedColor}&price=${product.Price}&image=${product.ImgUrls[0]}`;
    navigate(checkoutUrl);
  };

  const getPriceRange = () => {
    if (!product.Variations || product.Variations.length === 0) {
      return 'N/A'; // If there are no variations, return N/A
    }
  
    if (!selectedSize && !selectedColor) {
      // If neither size nor color is selected, return the original price range
      return `${Math.min(...product.Variations.map(variation => variation.price))} - ${Math.max(...product.Variations.map(variation => variation.price))}`;
    }
  
    if (selectedSize && selectedColor) {
      // Find the variation matching the selected size and color
      const selectedVariation = product.Variations.find(variation => variation.size === selectedSize && variation.name === selectedColor);
      if (selectedVariation) {
        // If variation is found, return the price of that variation
        return selectedVariation.price;
      } else {
        return 'N/A'; // If no matching variation is found, return N/A
      }
    }
  
    if (selectedSize && !selectedColor) {
      // If only size is selected, return the price range of variations with the selected size
      const variationsWithSelectedSize = product.Variations.filter(variation => variation.size === selectedSize);
      return `${Math.min(...variationsWithSelectedSize.map(variation => variation.price))} - ${Math.max(...variationsWithSelectedSize.map(variation => variation.price))}`;
    }
  
    if (!selectedSize && selectedColor) {
      // If only color is selected, return the price range of variations with the selected color
      const variationsWithSelectedColor = product.Variations.filter(variation => variation.name === selectedColor);
      return `${Math.min(...variationsWithSelectedColor.map(variation => variation.price))} `;
    }
  };
  
  

  // Render product details once loaded
  return (
    <div>

      <Header/>
      <p className='main1'>
        <Link to='/'>HOME</Link> <i className="fas fa-angle-right" /> <Link to="/men">MEN </Link>
        <i className="fas fa-angle-right" /> <Link to="/product/:id">{product.ProductName} </Link>
      </p>

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
          <p className='product_price'>LKR.{getPriceRange()}</p>


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

          
      
         
          {product.QuickDeliveryAvailable && (
            <div className="quickdelivery">
              <label>Quick Delivery Available - This product can be delivered within 1 week.</label>
              
            </div>
          )}

{product.Variations && product.Variations.some(variation => variation.size) && (
  <div className="sizebutton">
    <p>Sizes</p>
    {product.Variations
      .reduce((uniqueSizes, variation) => {
        if (!uniqueSizes.includes(variation.size)) {
          uniqueSizes.push(variation.size);
        }
        return uniqueSizes;
      }, [])
      .map((size, index) => (
        <button
          key={index}
          className={selectedSize === size ? 'selected' : ''}
          onClick={() => handleSizeClick(size)}
        >
          {size}
        </button>
      ))}
    {selectedSize && (
      <button className="clear-button" onClick={() => setSelectedSize(null)}>
        Clear Size
      </button>
    )}
  </div>
)}
{!product.Variations.some(variation => variation.size) && (
  <div className="color-section">
    <p>Colors</p>
    {product.Variations.map((variation, index) => (
      <button
        key={index}
        className={selectedColor === variation.name ? 'selected' : ''}
        onClick={() => handleColorClick(variation.name)}
        value={variation.name}
      >
        {variation.name}
      </button>
    ))}
  </div>
)}

{selectedSize && (
  <div className="color-section">
    <p>Colors</p>
    {product.Variations
      .filter(variation => variation.size === selectedSize)
      .map((variation, index) => (
        <button
          key={index}
          className={selectedColor === variation.name ? 'selected' : ''}
          onClick={() => handleColorClick(variation.name)}
          value={variation.name}
        >
          {variation.name}
        </button>
      ))}
  </div>
)}



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
              <button onClick={handleBuyNow}>Buy Now</button>
            </div>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default Product;
