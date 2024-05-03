import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Fixed import statement

import Admin from '../admin/admin';
import Men from '../Frontend/Men';
import Women from '../Frontend/Women';
import Best from '../Frontend/Best';
import Product from '../Frontend/Product';
import Cart from '../Frontend/Cart';
import Home from '../Frontend/Home';
import Refund from '../Frontend/refund/refund'
import RefundEdit from '../Frontend/refund/refundEdit'
import RefundPolicy from '../Frontend/refund/refundPolicy';
import Checkout from '../Frontend/Header/Checkout';
import MenBag from '../Frontend/Header/MenBag';
import MenShoes from '../Frontend/Header/MenShoes';

function App() {
  return (
    <div>
     <Admin/>
    </div>
  );
}

export default App;
