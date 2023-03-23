import { PropsWithChildren, useReducer } from 'react';
import { CartContext, cartReducer } from './';
import { ICartProduct } from '@/interfaces';

export interface CartState {
    cart: ICartProduct[]
}

const CART_INITIAL_STATE: CartState = {
	cart: []
};

export const CartProvider: React.FC<PropsWithChildren> = ({ children }) => {

	const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

	const addProductToCart = (product: ICartProduct) => {
		const productInCart = state.cart.some( item => item._id === product._id );
		if ( !productInCart ) return dispatch({ type: 'Cart - Update products in cart', payload: [...state.cart, product ] });

		const productInCartButDifferentSize = state.cart.some( item => item._id === product._id && item.size === product.size );
		if ( !productInCartButDifferentSize ) return dispatch({ type: 'Cart - Update products in cart', payload: [...state.cart, product ] });

		// Acumulate
		const updatedProducts = state.cart.map( item => {
			if ( item._id !== product._id ) return item;
			if ( item.size !== product.size ) return item;

			item.quantity += product.quantity;
			return item;
		});

		dispatch({ type: 'Cart - Update products in cart', payload: updatedProducts });
	};

	return (
		<CartContext.Provider value={{
			...state,
			addProductToCart
		}}>
			{ children }
		</CartContext.Provider>
	);
};