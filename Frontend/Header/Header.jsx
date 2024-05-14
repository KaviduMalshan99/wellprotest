import './Header.scss';
import Logo from '../../src/assets/logo.png';
import { useCart } from '../CartContext';
import Menbag from '../../src/assets/menbag.png'
import MenShoe from '../../src/assets/Menshoe.png'
import WomenBag from '../../src/assets/womenbag.png'
import WomenShoe from '../../src/assets/womenshoe.png'

import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../src/store/useAuthStore';

const Header = () => {
    const { cartItems } = useCart();
    const numberOfDistinctProducts = cartItems.length;
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();  // Extracting user info from the store

    const handleUserIconClick = () => {
        // Redirect based on authentication status
        if (isAuthenticated) {
            navigate('/profilee');  // Adjust this path if necessary
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="mmainheader">
            <div className="hleft-section">
                <img src={Logo} alt="Logo" className="hlogo" />
            </div>
            <div className="hcenter-section">
                <ul>
                    <li><Link to='/' className="hhui2">Home</Link></li>
                    <li className="dropdown">
                        <Link to='/men' className="hhui2">Men</Link>
                        <div className="dropdown-content">
                            <Link to='/menbag'>
                            <div>
                               <p style={{fontWeight:"bolder",marginLeft:"15px"}}>Men's Bags</p> 
                                <img src={Menbag} style={{height:"120px",width:"120px"}}/>
                            </div>
                            </Link>
                            <Link to='/menshoes'>
                            <div>
                                <p style={{fontWeight:"bolder",marginLeft:"15px"}}>Men's Shoes</p> 
                                <img src={MenShoe} style={{height:"120px",width:"120px"}} />
                            </div>
                            </Link>
                            
                            
                        </div>
                    </li>
                    <li className="dropdown">
                        <Link to="/women" className="hhui2">Women</Link>
                        <div className="dropdown-content">
                            <Link to='/womenbags'>
                            <div>
                               <p style={{fontWeight:"bolder",marginLeft:"15px"}}>Women's Bags</p> 
                                <img src={WomenBag} style={{height:"120px",width:"120px"}} />
                            </div>
                            </Link>
                            <Link to='/womenshoes'>
                            <div>
                               <p style={{fontWeight:"bolder",marginLeft:"15px"}}>Women's Shoes</p> 
                                <img src={WomenShoe} style={{height:"120px",width:"120px"}} />
                            </div>
                            </Link>
                            
                            
                        </div>
                    </li>
                    <li><Link to='/men' className="hhex">Exclusive</Link></li>
                </ul>
            </div>
            <div className="hright-section">
                <ul className="hhui1">
                    <li>
                        <form action="" className="searchh">
                            <input type="search" className="hsearch" required />
                            <i className="fa fa-search"></i>
                        </form>
                    </li>
                    <li>
                        <div className="hhui22" onClick={handleUserIconClick}>
                            {isAuthenticated && user?.profileUrl ?
                                <img src={user.profileUrl} alt="User" style={{ width: '30px', height: '30px', borderRadius: '50%' }} /> :
                                <i className="far fa-user-circle fa-xl" style={{ color: '#ffffff' }}></i>
                            }
                        </div>
                    </li>
                    <li>
                        <div className="hhui22">
                            <Link to='/cart'>
                                <i className="fas fa-cart-shopping fa-xl" style={{ color: '#ffffff' }}></i>
                                <span className="cart-count">{numberOfDistinctProducts}</span>
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Header;
