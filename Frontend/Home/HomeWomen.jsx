import { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './HomeMen.scss';
import Mint from '../../src/assets/int.png';
import Koko from '../../src/assets/koko.png';
import LOGOO from '../../src/assets/logoorange.png';
import { PropagateLoader } from 'react-spinners'; 


const HomeWomen = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [selectedRatings, setSelectedRatings] = useState([]);
  const scrollContainerRef = useRef(null);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/products');
        console.log('Response:', response.data); // Log response data to check structure
        
        // Filter products with category names "Men"
        const filteredData = response.data.response.filter(product =>
          product.Categories.includes("Women")
        );
        console.log('Filtered Data:', filteredData); // Log filtered data
        
        setData(filteredData);
        setTimeout(() => setLoading(false),2000);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();
  }, []);

  // Apply filters whenever ratings selection changes
useEffect(() => {
  let filteredProducts = data;

  // Apply category filter
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter((product) =>
      product.Categories.includes(selectedCategory)
    );
  }

  // Apply price range filter
  if (minPrice && maxPrice) {
    filteredProducts = filteredProducts.filter(product => {
      const minProductPrice = Math.min(...product.Variations.map(variation => variation.price));
      return minProductPrice >= parseFloat(minPrice) && minProductPrice <= parseFloat(maxPrice);
    });
  }

  // Apply ratings filter
  if (selectedRatings.length > 0) {
    filteredProducts = filteredProducts.filter(product => selectedRatings.includes(product.Rating.toString()));
  }

  if (sortOrder === 'minToMax') {
    filteredProducts.sort((a, b) => Math.min(...a.Variations.map(variation => variation.price)) - Math.min(...b.Variations.map(variation => variation.price)));
  } else if (sortOrder === 'maxToMin') {
    filteredProducts.sort((a, b) => Math.min(...b.Variations.map(variation => variation.price)) - Math.min(...a.Variations.map(variation => variation.price)));
  }

  setFilteredData(filteredProducts);
}, [data, selectedCategory, minPrice, maxPrice, selectedRatings, sortOrder]);

  
  
const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
    


  return (

    <>
    
    {loading && (
      <div className="loader-container">
        <div className="loader-overlay">
          <img src={LOGOO} alt="Logo" className="loader-logo" />
          <PropagateLoader color={'#ff3c00'} loading={true} />
        </div>
      </div>
    )}

      {!loading && (
    <div>
      

      <div className="menmids">
        <div className="mens" ref={scrollContainerRef}>
          {filteredData.map(record => (
            <div className="boxs" key={record.ProductId}>
              <div className="imgages">
                <img src={record.ImgUrls[0]} alt="" />
                <div className="overlay2s">
                  <img src={record.ImgUrls[1]} alt="" />
                </div>
                <div className="overlay3s">
                <Link to={`/product/${record.ProductId}`}><p >VIEW MORE</p></Link>
                </div>
              </div>
              <div className="informationss">
                <div className="title">{record.ProductName}</div>
                <div className="price">LKR.{(Math.min(...record.Variations.map(variation => variation.price))).toFixed(2)} </div>
                <div className="ratingss">
                  <div className="paymentsimgs">
                    <div className='p01'>
                     <p> or 3 X {((Math.min(...record.Variations.map(variation => variation.price))).toFixed(2) / 3.00).toFixed(2)} with </p><img src={Mint} className='intpay' />
                    </div>
                    <div className='p02'>
                    <p>or 3 X {((Math.min(...record.Variations.map(variation => variation.price))).toFixed(2) / 3.00).toFixed(2)} with   </p><img src={Koko} className='kokopay' />
                    </div>
                  </div>
                </div>
                <div className="price">{record.price}</div>
              </div>
            </div>
          ))}
        </div>
        
      </div>

    </div>
      )}
    </>
  );
};

export default HomeWomen;
