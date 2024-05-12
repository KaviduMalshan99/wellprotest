import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Men.css';
import Mint from '../../src/assets/int.png';
import Koko from '../../src/assets/koko.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faStar } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import LOGOO from '../../src/assets/logoorange.png';
import { PropagateLoader } from 'react-spinners'; 

const WomenShoes = () => {
  const [loading, setLoading] = useState(true);
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
        const filteredData = response.data.response.filter(product =>
          product.Categories.includes("Women") && product.Categories.includes("Shoes")
        );
        setData(filteredData);
        setTimeout(() => setLoading(false), 2000);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();
  }, []);

  useEffect(() => {
    let filteredProducts = data;

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter((product) =>
        product.Categories.includes(selectedCategory)
      );
    }

    if (minPrice && maxPrice) {
      filteredProducts = filteredProducts.filter(product => {
        const minProductPrice = Math.min(...product.Variations.map(variation => variation.price));
        return minProductPrice >= parseFloat(minPrice) && minProductPrice <= parseFloat(maxPrice);
      });
    }

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

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const handleRatingChange = (event) => {
    const rating = event.target.value;
    if (event.target.checked) {
      setSelectedRatings((prevRatings) => [...prevRatings, rating]);
    } else {
      setSelectedRatings((prevRatings) => prevRatings.filter((r) => r !== rating));
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
          <Header />
          <p className='menmain'>SHOP WOMENS SHOES</p>
          <p className='menmain1'>
            <Link to='/'>HOME</Link> <i className="fas fa-angle-right" /> <Link to="/women">WOMEN </Link><i className="fas fa-angle-right" /><Link to="/womenshoes"> SHOES </Link><i className="fas fa-angle-right" />
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
                  {/* Your rating checkboxes */}
                </div>
              </div>
            </div>

            <div className="men">
              {filteredData.map(record => (
                <div className="box" key={record.ProductId}>
                  {/* Your product card JSX */}
                </div>
              ))}
            </div>
          </div>

          <Footer />
        </div>
      )}
    </>
  );
};

export default WomenShoes;
