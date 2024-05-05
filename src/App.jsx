
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Fixed import statement


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
import WomenBags from '../Frontend/Header/WomenBag';
import WomenShoes from '../Frontend/Header/WomenShoes';
import { CartProvider } from '../Frontend/CartContext';


//admin section pages
import Admin from '../admin/admin';
import Dashboard from '../admin/Dashboard';
import Profile from '../admin/Profile';
import Categories from '../admin/Categories';
import Products from '../admin/Product';
import Users from '../admin/Users';
import Orders from '../admin/Orders';
import Ratings from '../admin/Ratings';
import Overview from '../admin/Overview';
import Suppliers from '../admin/Suppliers';
import Warehouse from '../admin/Warehouse';
import RefundOrders from '../admin/refundOrders';
import RefundEmail from '../admin/refundEmail';
import Notification from '../admin/Notification';

function App() {
  return (
    <CartProvider>
    <div>
     <Router> {/* Changed to Router */}
        <Routes>
          <Route path='/' element={<Home />} /> 
          <Route path='/men' element={<Men />} /> 
          <Route path='/women' element={<Women />} /> 
          <Route path='/best' element={<Best />} /> 
          <Route path='/product/:id' element={<Product />} /> 
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/refund' element={<Refund />} />
          <Route path='/refundedit' element={<RefundEdit />} />
          <Route path='/refundpolicy' element={<RefundPolicy />} />
          
          
          <Route path='/menbag' element={<MenBag />} />
          <Route path='/menshoes' element={<MenShoes />} />
          <Route path='/womenbags' element={<WomenBags />} />
          <Route path='/womenshoes' element={<WomenShoes />} />


          <Route path='/admin' element={<Admin />} >
            {/* Sub-routes for admin */}
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='profile' element={<Profile />} />
            <Route path='categories' element={<Categories />} />
            <Route path='products' element={<Products />} />
            <Route path='users' element={<Users />} />
            <Route path='orders' element={<Orders />} />
            <Route path='rating' element={<Ratings />} />
            <Route path='supplier' element={<Suppliers />} />
            <Route path='warehouse' element={<Warehouse />} />
            <Route path='overview' element={<Overview />} />
            <Route path='refundorder' element={<RefundOrders />} />
            <Route path='refundemail' element={<RefundEmail />} />
            <Route path='notification' element={<Notification />} />
          </Route>
          

        </Routes>
      </Router> 


    </div>

    </CartProvider>

  );
}

export default App;
