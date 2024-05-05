import './Header.css';
import Logo from '../../src/assets/logo.png';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';

const Header = () => {
    const { state } = useCart();
    const numberOfDistinctProducts = state.items.length;

    return (
        <div className="mmainheader">
            <div className="hleft-section">
                <img src={Logo} alt="Logo" className="hlogo" />
            </div>
            <div className="hcenter-section">
                <ul>
                    <li><Link to='/' className="hhui2">Home</Link></li>
                    <li><Link to='/men' className="hhui2">Men</Link></li>
                    <li><Link to="/women" className="hhui2">Women</Link></li>
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
                    <li><div className="hhui22"><Link to="/login" onClick={() => console.log('Login link clicked')}>
                                <i className="far fa-user-circle fa-xl" style={{ color: '#ffffff' }}></i>
                            </Link>
                            </div></li>
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
