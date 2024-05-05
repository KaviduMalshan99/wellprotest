import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Men.css';
import Mint from '../../src/assets/int.png';
import Koko from '../../src/assets/koko.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faStar } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header/Header';

import Footer from '../Footer/Footer';

const WomenBag = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [selectedRatings, setSelectedRatings] = useState([]);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/products');
        console.log('Response:', response.data); // Log response data to check structure
        
        // Filter products with category names "Men" and "Bags"
        const filteredData = response.data.response.filter(product =>
          product.Categories.includes("Women") && product.Categories.includes("Bags")
        );
        console.log('Filtered Data:', filteredData); // Log filtered data
        
        setData(filteredData);
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

  

    // Function to handle minimum price change
    const handleMinPriceChange = (event) => {
      setMinPrice(event.target.value);
    };
  
    // Function to handle maximum price change
    const handleMaxPriceChange = (event) => {
      setMaxPrice(event.target.value);
    };

    // Function to handle sorting change
    const handleSortChange = (order) => {
      setSortOrder(order);
    };

    // Function to handle rating change
    const handleRatingChange = (event) => {
      const rating = event.target.value;
      if (event.target.checked) {
        setSelectedRatings((prevRatings) => [...prevRatings, rating]);
      } else {
        setSelectedRatings((prevRatings) => prevRatings.filter((r) => r !== rating));
      }
    };


  return (
    <div>
      <Header/>
      <p className='menmain'>SHOP WOMEN BAGS</p>
      <p className='menmain1'>
        <Link to='/'>HOME</Link> <i className="fas fa-angle-right" /> <Link to="/women">WOMEN </Link><i className="fas fa-angle-right" /><Link to="/menbags"> BAGS </Link><i className="fas fa-angle-right" />
      </p>

      <div className="menmid">
        <div className="menfilter">
          <h2 className='menfiltertitle'>Filter Options</h2>
          
          
           
          <div className="pricefilter">

            <p className='fittertitles'>Price Range:</p>
              <div className='minmaxdiv'>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                /> -
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                />
              </div>

              <div className="sortprice">
                {/* Sorting */}
                <p className='fittertitles'>Sort By:</p>
                <div className='sortminmax'>
                  <button className='btnsortminmax' onClick={() => handleSortChange('maxToMin')}>Price: Low to High</button>
                  <button className='btnsortminmax' onClick={() => handleSortChange('minToMax')}>Price: High to Low</button>
                </div>
              </div>
          </div>

          <div className="ratingsFilter">
  <p className='fittertitles'>Ratings:</p>
  <div className='ratingsOptions'>
    <label>
      <div className='startoption1'>
        <input
          type="checkbox"
          value={5}
          onChange={handleRatingChange}
        />
      </div>
      <div className='startoption2'>
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
      </div>
    </label>
    <label>
      <div className='startoption1'>
        <input
          type="checkbox"
          value={4}
          onChange={handleRatingChange}
        />
      </div>
      <div className='startoption2'>
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
      </div>
    </label>
    <label>
      <div className='startoption1'>
        <input
          type="checkbox"
          value={3}
          onChange={handleRatingChange}
        />
      </div>
      <div className='startoption2'>
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
      </div>
    </label>
    <label>
      <div className='startoption1'>
        <input
          type="checkbox"
          value={2}
          onChange={handleRatingChange}
        />
      </div>
      <div className='startoption2'>
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
      </div>
    </label>
    <label>
      <div className='startoption1'>
        <input
          type="checkbox"
          value={1}
          onChange={handleRatingChange}
        />
      </div>
      <div className='startoption2'>
        <FontAwesomeIcon icon={faStar} />
      </div>
    </label>
  </div>
</div>


        </div>

        <div className="men">
          {filteredData.map(record => (
            <div className="box" key={record.ProductId}>
              <div className="imgage">
                <img src={record.ImgUrls[0]} alt="" />
                <div className="overlay">
                  <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                </div>
                <div className="overlay2">
                  <Link to={`/product/${record.ProductId}`}><p>VIEW MORE</p></Link>
                </div>
              </div>
              <div className="informations">
                <div className="title">{record.ProductName}</div>
                <div className="price">LKR.{(Math.min(...record.Variations.map(variation => variation.price))).toFixed(2)} </div>
                <div className="ratings">
                  <div className="paymentsimg">
                    <div className='p01'>
                      or 3 X {((Math.min(...record.Variations.map(variation => variation.price))).toFixed(2) / 3.00).toFixed(2)} with <img src={Mint} className='intpay' />
                    </div>
                    <div className='p02'>
                      or 3 X {((Math.min(...record.Variations.map(variation => variation.price))).toFixed(2) / 3.00).toFixed(2)} with<img src={Koko} className='kokopay' />
                    </div>
                  </div>
                </div>
                <div className="price">{record.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <Footer/>
    </div>
  );
};

export default WomenBag;
