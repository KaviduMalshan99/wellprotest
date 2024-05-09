
import { useState, useEffect,useCallback } from 'react';
import { useCart } from './CartContext';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import {useAuthStore} from "../src/store/useAuthStore"

const Cart = () => {
  const { state, dispatch } = useCart();
  const {user} =useAuthStore();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  const userId = user?.UserId;
  console.log("customerid: ",userId);

  const generateCartId = useCallback(() => {
    return `CID_${uuidv4()}`;
  }, []);

  const fetchCartItems = useCallback(async () => {
    if (!userId) {
        console.error("UserId is undefined");
        return;
    }
    try {
        const response = await axios.get(`/cart/${userId}`);
        dispatch({ type: 'SET_ITEMS', items: response.data.items });
    } catch (error) {
        console.error('Failed to fetch cart items:', error);
    }
}, [userId, dispatch]);

useEffect(() => {
    fetchCartItems();
}, [fetchCartItems]);

useEffect(() => {
    if (selectAll) {
        const newSelectedItems = new Set(state.items.map(item => item.id));
        setSelectedItems(newSelectedItems);
    } else {
        setSelectedItems(new Set());
    }
}, [selectAll, state.items]);


  const handleSelectAllToggle = () => {
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id) => {
    const newSelectedItems = new Set(selectedItems);
    if (selectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
    setSelectAll(newSelectedItems.size === state.items.length);
  };


  const handleRemoveSelectedItems = async () => {
    try {
        await axios.delete('/cart/item/remove', { data: { userId, itemIds: Array.from(selectedItems) }});
        dispatch({ type: 'REMOVE_SELECTED_ITEMS', ids: Array.from(selectedItems) });
        setSelectedItems(new Set());
        setSelectAll(false);
    } catch (error) {
        console.error('Failed to remove items:', error);
    }
};

  // Update quantity in the backend
  const updateQuantity = async (id, delta) => {
    try {
      const item = state.items.find(item => item.id === id);
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0 && newQuantity <= item.availableCount) {
        await axios.put('/cart/item/update', { cartId: YOUR_CART_ID, itemId: id, quantity: newQuantity });
        dispatch({ type: 'UPDATE_QUANTITY', id: id, delta });
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const subtotal = [...selectedItems].reduce(
    (acc, id) => acc + (state.items.find(item => item.id === id)?.price || 0) * (state.items.find(item => item.id === id)?.quantity || 0),
    0
  );

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px'  }}>
        {/* Left Section */}
        <div style={{ width: '70%',display:'flex',flexDirection:'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <input
                type="checkbox"
                onChange={handleSelectAllToggle}
                checked={selectAll}
              /> Select All
            </div>
            <button style={{width:'auto'}} onClick={handleRemoveSelectedItems}>Delete Selected</button>
          </div>
          {state.items.map((item) => (
            <div className='cartproduct' key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <input
                style={{marginLeft:'-458px'}}
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={() => handleSelectItem(item.id)}
              />
              <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', marginLeft:'-550px' }} />
              <div>{item.name}</div>
              <div>{item.color}</div>
              <div>{item.size}</div>
              <div>Available: {item.availableCount}</div>

              <div>LKR.{item.price.toFixed(2)}</div>
              <div style={{display:'flex',gap:'5px',alignItems:'center'}}>
                <button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, delta: -1 })}
                  disabled={item.quantity === 1}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, delta: 1 })}
                  disabled={item.quantity >= item.availableCount}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div style={{ width: '28%', border: '1px solid gray', padding: '10px' }}>
          <h2>Order Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Subtotal ({selectedItems.size} items):</div>
            <div>${subtotal.toFixed(2)}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Shipping Fee:</div>
            <div>550.00</div>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <input style={{width:'200px'}} type="text" placeholder="Voucher code" />
            <button style={{width:'100px'}}>Apply</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
            <div>Total Price:</div>
            <div>${subtotal.toFixed(2)}</div>
          </div>
          <button style={{ width: '100%', padding: '10px', marginTop: '20px' }}>Proceed to Checkout</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;