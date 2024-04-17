import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Men.css'
import Mint from '../src/assets/int.png'
import Koko from '../src/assets/koko.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';

const Men = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/products');
        setData(response.data.response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <p className='main'>SHOP MENS</p>
      <p className='main1'>
        <Link to='/'>HOME</Link> <i className="fas fa-angle-right" /> <Link to="/men">MEN </Link>
      </p>

      <div className="men">
        {data.map(record => (
          <div className="box" key={record.ProductId}>
            <div className="imgage">
              <img src={record.ImgUrls[0]} alt="" />
              <div className="overlay">
                <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                <FontAwesomeIcon icon={faHeart} className="heart-icon"/>
              </div>
              <div className="overlay2">
                <Link to={`/product/${record.ProductId}`}><p>VIEW MORE</p></Link>
              </div>
            </div>
            <div className="informations">
              <div className="title">{record.ProductName}</div>
              <div className="price">LKR.{record.Price} </div>
              <div className="ratings">
                <div className="paymentsimg">
                    <div className='p01'>
                    or 3 X {(record.Price / 3.00).toFixed(2)} with <img src={Mint} className='intpay' />
                    </div>
                    <div className='p02'>
                    or 3 X {(record.Price / 3.00).toFixed(2)} with<img src={Koko} className='kokopay' />
                    </div>
                   
                  
                </div>
                
              </div>
              <div className="price">{record.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Men;
