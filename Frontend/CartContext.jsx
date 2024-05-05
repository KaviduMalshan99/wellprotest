import { createContext, useContext, useReducer } from 'react';

// Cart context
const CartContext = createContext();

// Initial cart state
const initialCartState = {
    items: [],
    total: 0
};

// Reducer for cart actions
function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM':
            // Check if the item already exists
            const existingItem = state.items.find(item => item.id === action.item.id);
                if (existingItem) {
                    // Increase quantity
                    return {
                    ...state,
                    items: state.items.map(item => 
                        item.id === action.item.id ? { ...item, quantity: item.quantity + action.item.quantity } : item
                    )
                    };
                } else {
                    // Add new item
                    return {
                    ...state,
                    items: [...state.items, action.item],
                    total: state.total + (action.item.price * action.item.quantity)
                    };
                }
        case 'REMOVE_ITEM':
            // Calculate the new total when an item is removed
            const updatedItems = state.items.filter(item => item.id !== action.id);
            const newTotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            return {
                ...state,
                items: updatedItems,
                total: newTotal
            };
        case 'UPDATE_QUANTITY':
            // Update the quantity of an item
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.id ? { ...item, quantity: Math.max(1, item.quantity + action.delta) } : item
                )
            };
        case 'REMOVE_SELECTED_ITEMS':
            // Remove selected items by filtering out those whose ids are in action.ids
            const remainingItems = state.items.filter(item => !action.ids.includes(item.id));
            const updatedTotal = remainingItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            return {
                ...state,
                items: remainingItems,
                total: updatedTotal
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

// Cart Provider to wrap around App component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialCartState);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);
