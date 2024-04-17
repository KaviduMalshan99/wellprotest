import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Fixed import statement

import Admin from '../admin/admin';
import Men from '../Frontend/Men';
import Women from '../Frontend/Women';
import Best from '../Frontend/Best';
import Product from '../Frontend/Product';
import Cart from '../Frontend/Cart';
import Home from '../Frontend/Home';
import Footer from '../Frontend/Footer/Footer';
import Header from '../Frontend/Header/Header'

function App() {
  return (
    <div>
     <Admin/>
    </div>
  );
}

export default App;
