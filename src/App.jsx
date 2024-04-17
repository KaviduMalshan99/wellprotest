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
     <Router> {/* Changed to Router */}
        <Routes>
          <Route path='/' element={<Home />} /> 
          <Route path='/men' element={<Men />} /> 
          <Route path='/women' element={<Women />} /> 
          <Route path='/best' element={<Best />} /> 
          <Route path='/admin' element={<Admin />} />
          <Route path='/product/:id' element={<Product />} /> 
          <Route path='/cart' element={<Cart />} />
          <Route path="/refund" element={<Refund />} />
        <Route path="/refundedit/:orderId" element={<RefundEdit />} />
        <Route path="/refundPolicy" element={<RefundPolicy />} />



          {/* Header parts */}
          <Route path='/header' element={<Header />} /> 


          {/* Footer parts */}
          <Route path='/footer' element={<Footer />} /> 

        </Routes>
      </Router>
    </div>
  );
}

export default App;
