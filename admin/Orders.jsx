
import { Link } from 'react-router-dom'; // Importing useNavigate hook
import './Orders.css';

const Orders = () => {
  

  return (
    <div className='mainContainer'>
      {/* Button triggering the refund */}
      <Link to="/admin/refundorder"><button type="button" className='obutton' >Refund Orders</button></Link>
      <button type="button" className='obutton' >Orders</button>
      <button type="button" className='obutton' >Cancel Orders</button>

    </div>
  );
};

export default Orders;