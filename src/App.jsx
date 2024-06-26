import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CheckoutProvider } from '../Frontend/order/CheckoutContext';  // Adjust the path as necessary


// Frontend components

import Men from '../Frontend/Men';
import Women from '../Frontend/Women';
import Best from '../Frontend/Best';
import Product from '../Frontend/Product';
import Cart from '../Frontend/Cart';
import Home from '../Frontend/Home';
import Refund from '../Frontend/refund/refund';
import RefundEdit from '../Frontend/refund/refundEdit';
import RefundPolicy from '../Frontend/refund/refundPolicy';
import Checkout from '../Frontend/order/Checkout';
import CustomerOrders from '../Frontend/order/CustomerOrders';

import MenBag from '../Frontend/Header/MenBag';
import MenShoes from '../Frontend/Header/MenShoes';
import WomenBags from '../Frontend/Header/WomenBag';
import WomenShoes from '../Frontend/Header/WomenShoes';
import Sidep from '../Frontend/user/UserPSide'
import Header from '../Frontend/Header/Header';

import Admin from '../admin/admin';
import Dashboard from '../admin/Dashboard';
import Profile from '../admin/Profile';
import Categories from '../admin/Categories';
import Products from '../admin/Product';
import Users from '../admin/Users';
import Orders from '../admin/Orders';
import Ratings from '../admin/Reviews';

import HomeMen from '../Frontend/Home/HomeMen';

import Overview from '../admin/Overview';
import Suppliers from '../admin/Suppliers';
import Warehouse from '../admin/Warehouse';
import RefundOrders from '../admin/refundOrders';
import RefundEmail from '../admin/refundEmail';
import RefundApprove from '../admin/refundApproves';

import Notification from '../admin/Notification';
import SupplierEmail from '../admin/SupplierEmail';
import SupplierReg from '../admin/SupplierReg';
import SupplierStok from '../admin/SupplierStock';
import UserP from '../Frontend/user/UserProfile';

import OrderTable from '../admin/order/OrderTable'
import OrderDetails from '../admin/order/OrderDetails'
import AdminDashboard from '../admin/order/AdminDashboard';
import ShippingMethodManager from '../admin/order/ShippingMethodManager';

import WarehouseOrders from '../admin/WarehouseOrders';
import OrdersTable from '../admin/OrdersTable';
import CurrentStock from '../admin/WarehouseStocks';
import WarehouseEdit from '../admin/WarehouseEdit';
import WarehouseDetails from '../admin/WarehouseInven';
import UserDetails from '../admin/UserDetails'




// User authentication components
import ULog from '../Frontend/user/UserLog';  // Login page
import Reg from '../Frontend/user/Reg';      // Registration page

import CheckLoginStatus from './CheckLoginStatus'
import PrivateRoute from "./PrivateRoute"
import { USER_ROLES } from './constants/roles';


// Cart Context
import { CartProvider } from '../Frontend/CartContext';


// Query client instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
        <CheckoutProvider>

          <Routes>
          <Route path='/men' element={<Men />} />



            <Route element={<CheckLoginStatus/>}>
              <Route path='/login' element={<ULog />} />
              <Route path='/register' element={<Reg />} />
              <Route path='/ulogin' element={<Sidep/>}/>
            </Route>


            {/*main files*/}
              <Route path='/login' element={<ULog />} />
              <Route path='/profilee' element={<UserP />} ></Route>
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
              <Route path='/homemen' element={<HomeMen />} />


            {/* Common Routes */}
            <Route
              element={
                <PrivateRoute
                  permissionLevel={[USER_ROLES.CUSTOMER, USER_ROLES.ADMIN]}
                />

              }
            >

              <Route path='/' element={<Home />} />
              
              

            </Route>

            

            {/* Customer Routes */}
            <Route
              element={<PrivateRoute permissionLevel={[USER_ROLES.CUSTOMER]} />}
            >
              {/* <Route path="/customer" element={<Customer /200>} /> */}
              <Route path='/login' element={<ULog />} />
              <Route path='/profilee' element={<UserP />} ></Route>
              <Route path='/' element={<Home />} />
              <Route path='/men' element={<Men />} />
              <Route path='/women' element={<Women />} />
              <Route path='/best' element={<Best />} />
              <Route path='/product/:id' element={<Product />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/refund' element={<Refund />} />
              <Route path='/refundedit/:orderId' element={<RefundEdit />} />
              <Route path='/refundpolicy' element={<RefundPolicy />} />
              <Route path='/menbag' element={<MenBag />} />
              <Route path='/menshoes' element={<MenShoes />} />
              <Route path='/womenbags' element={<WomenBags />} />
              <Route path='/womenshoes' element={<WomenShoes />} />
              <Route path='/homemen' element={<HomeMen />} />
              
            </Route>

            {/* Admin Routes */}
            <Route
              element={<PrivateRoute permissionLevel={[USER_ROLES.ADMIN]} />}
            >
             <Route path='/admin' element={<Admin />} >
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='profile' element={<Profile />} />
              <Route path='categories' element={<Categories />} />
              <Route path='products' element={<Products />} />
              <Route path='users' element={<Users />} 
              
              />
              <Route path='orders' element={<Orders />} />
              <Route path='rating' element={<Ratings />} />
              <Route path='supplier' element={<Suppliers />} />
              <Route path='warehouse' element={<Warehouse />} />
              <Route path='overview' element={<Overview />} />
              <Route path='refundorder' element={<RefundOrders />} />
              <Route path='refundemail' element={<RefundEmail />} />
              <Route path='refundapprove' element={<RefundApprove />} />

              <Route path='notification' element={<Notification />} />
              <Route path='supplierEmail' element={<SupplierEmail />} />
              <Route path='supplierreg' element={<SupplierReg />} />
              <Route path='supplierstock' element={<SupplierStok />} />

              <Route path='OrderTable' element={<OrderTable />} />
              <Route path='coupon' element={<AdminDashboard />} />
              <Route path='OrderDetails/:orderId' element={<OrderDetails />} />
              <Route path='Shipping' element={<ShippingMethodManager />} />

              <Route path='warehouse' element={<Warehouse />} />
              <Route path="warehouseorders" element={<WarehouseOrders />} />
              <Route path="orderstable" element={<OrdersTable />} />
              <Route path="current-stock" element={<CurrentStock />} />
              <Route path="edit-warehouse/:id" element={<WarehouseEdit />} />
              <Route path="warehouse-details/:id" element={<WarehouseDetails />} />
              <Route path='/admin/users/:userId' element={<UserDetails />} />



            </Route>

            </Route>

            <Route path='/' element={<Home />} />
            <Route path='/men' element={<Men />} />
            <Route path='/women' element={<Women />} />
            <Route path='/best' element={<Best />} />
            <Route path='/product/:id' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/CustomerOrders' element={<CustomerOrders />} />
            <Route path='/refund' element={<Refund />} />
            <Route path='/refundedit' element={<RefundEdit />} />
            <Route path='/refundpolicy' element={<RefundPolicy />} />

            <Route path='/menbag' element={<MenBag />} />
            <Route path='/menshoes' element={<MenShoes />} />
            <Route path='/womenbags' element={<WomenBags />} />
            <Route path='/womenshoes' element={<WomenShoes />} />
            <Route path='/homemen' element={<HomeMen />} />

            

            
          </Routes>
          </CheckoutProvider>

        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
