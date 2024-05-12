
import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import { useAuthStore } from "../src/store/useAuthStore";
import './Cart.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Cart = () => {
    const { user } = useAuthStore();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [voucherDiscount, setVoucherDiscount] = useState(0);

    const fetchCartItems = async () => {
        if (!user?.UserId) {
            console.error("UserId is undefined");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/api/cart/${user.UserId}`);
            setCartItems(response.data.map(item => ({ ...item, size:item.size || 'Free Size',quantity: item.quantity }))); // Map through and set quantity
            setLoading(false);
            console.log(response)
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchCartItems();
    }, [user?.UserId]);

    const handleSelectAll = (event) => {
        const newSelectedItems = new Set();
        if (event.target.checked) {
            cartItems.forEach(item => newSelectedItems.add(item._id));
        }
        setSelectedItems(newSelectedItems);
    };

    const handleSelectItem = (id) => {
        const newSelectedItems = new Set(selectedItems);
        if (selectedItems.has(id)) {
            newSelectedItems.delete(id);
        } else {
            newSelectedItems.add(id);
        }
        setSelectedItems(newSelectedItems);
    };

    const handleUpdateQuantity = async (id, delta) => {
        const newCartItems = cartItems.map(item => {
            if (item._id === id) {
                const newQuantity = item.quantity + delta;
                return { ...item, quantity: newQuantity >= 1 ? newQuantity : 1 };
            }
            return item;
        });
        setCartItems(newCartItems);
    
        // Find the item to update
        const itemToUpdate = newCartItems.find(item => item._id === id);
        if (itemToUpdate) {
            try {
                const response = await axios.put(`http://localhost:3001/api/cart/update/${id}`, {
                    quantity: itemToUpdate.quantity,
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                if (response.status !== 200) {
                    console.error('Failed to update item quantity in the database');
                }
            } catch (error) {
                console.error('Error updating item quantity:', error);
            }
        }
    };
    

    const subtotal = cartItems.reduce((acc, item) => {
        if (selectedItems.has(item._id)) {
            return acc + (item.price * item.quantity);
        }
        return acc;
    }, 0);

    const total = subtotal - voucherDiscount + (selectedItems.size > 0 ? 550 : 0); // Shipping fee added only if items are selected

    const handleDeleteItem = (itemId) => {

        const itemToDelete = cartItems.find(item => item._id === itemId);
        if (!itemToDelete) {
            console.error("Item not found in local cart data.");
            toast.error("Item not found.");
            return;
        }

        // Use the cartId from the item
        const cartId = itemToDelete.cartId;
        console.log("Deleting item with CartId:", cartId);
    
        // Make API call to delete the item
        axios.delete(`http://localhost:3001/api/deletecart/${cartId}`)
            .then(response => {
                console.log("Response after deleting item:", response.data);
                // Update the cart items state to reflect the deletion
                const updatedCartItems = cartItems.filter(item => item.cartId !== cartId);
                setCartItems(updatedCartItems);
                // Also update selectedItems if the deleted item was selected
                setSelectedItems(new Set([...selectedItems].filter(id => id !== cartId)));
                toast.success('Item deleted successfully!');
            })
            .catch(error => {
                console.error('Failed to delete item from cart:', error);
                toast.error('Failed to delete item from cart');
            });
    };
    
    
    
    
    


    if (cartItems.length === 0) {
        return (
            <div>
                <Header />
                <p>Your cart is empty.</p>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="cart-container">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <input 
                                    type="checkbox" 
                                    checked={selectedItems.size === cartItems.length} 
                                    onChange={handleSelectAll} 
                                />
                            </th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Product Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item._id}>
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedItems.has(item._id)}
                                        onChange={() => handleSelectItem(item._id)}
                                    />
                                </td>
                                <td className='imagecon' >
                                    <div>
                                     <img src={item.image} alt={item.name}  />
                                    </div>
                                    <div  className='imgdetails'>
                                        <h2>{item.name}</h2><p>Size : {item.size}</p><p>Color : {item.color}</p>    
                                    </div>
                                    
                                    
                                </td>
                                <td className='quntitydetails'>
                                    <button onClick={() => handleUpdateQuantity(item._id, -1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleUpdateQuantity(item._id, 1)} >+</button>
                                </td>
                                <td>LKR {item.price.toFixed(2)}</td>
                                <td className='actioncon'>
                                    <button onClick={() => handleDeleteItem(item._id)} style={{background:"none"}}>
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ width: '50%',  padding: '10px', marginTop:"15px",borderRadius:"5px", marginLeft:"47%",display:"flex",flexDirection:"column",gap:"5px" }}>
                    <h2 style={{textAlign:"end"}}>Order Summary</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>Subtotal : </div>
                        <div>LKR.{subtotal.toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>Shipping Fee:</div>
                        <div>{selectedItems.size > 0 ? "550.00" : "0.00"}</div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <input style={{width:'200px'}} type="text" placeholder="Voucher code"  />
                        <button style={{width:'100px'}}>Apply</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                        <div>Total Price:</div>
                        <div>LKR.{total.toFixed(2)}</div>
                    </div>
                        <button style={{ width: '50%', padding: '10px', marginTop: '20px',marginLeft:"50%" }} onClick={() => alert('Checkout')}>Proceed to Checkout</button>
                            </div>
                        </div>
            <Footer /><ToastContainer/>
        </div>
    );
};

export default Cart;
