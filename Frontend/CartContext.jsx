import { createContext, useContext, useReducer } from 'react';

// Create a Context for the cart
const CartContext = createContext();

// Define the initial state of the cart
const initialCartState = {
    items: [],
    total: 0
};

// Reducer to handle actions related to the cart
function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM':
            const existingItem = state.items.find(item => item.id === action.item.id);
            if (existingItem) {
                // Increase the quantity of the existing item
                return {
                    ...state,
                    items: state.items.map(item => 
                        item.id === action.item.id ? { ...item, quantity: item.quantity + action.item.quantity } : item
                    ),
                    total: state.total + (action.item.price * action.item.quantity)
                };
            } else {
                // Add new item to the cart
                return {
                    ...state,
                    items: [...state.items, action.item],
                    total: state.total + (action.item.price * action.item.quantity)
                };
            }
        case 'REMOVE_ITEM':
            const updatedItems = state.items.filter(item => item.id !== action.id);
            const newTotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            return {
                ...state,
                items: updatedItems,
                total: newTotal
            };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.id ? { ...item, quantity: Math.max(1, item.quantity + action.delta) } : item
                )
            };
        case 'REMOVE_SELECTED_ITEMS':
            const remainingItems = state.items.filter(item => !action.ids.includes(item.id));
            const updatedTotal = remainingItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            return {
                ...state,
                items: remainingItems,
                total: updatedTotal
            };
        case 'SET_ITEMS':  // New case to handle setting items directly
            return {
                ...state,
                items: action.items,
                total: action.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

// Provider component to wrap around the application
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialCartState);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context throughout the application
export const useCart = () => useContext(CartContext);
