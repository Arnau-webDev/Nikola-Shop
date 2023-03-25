import { PropsWithChildren, useEffect, useReducer } from 'react';
import { CartContext, cartReducer } from './';
import { ICartProduct } from '@/interfaces';

import Cookies from 'js-cookie';

export interface CartState {
    cart: ICartProduct[]
}

const CART_INITIAL_STATE: CartState = {
	cart: []
};

export const CartProvider: React.FC<PropsWithChildren> = ({ children }) => {

	const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

	useEffect(() => {
		try {
			const cookieProducts = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')!) : [];
			dispatch({type: 'Cart - Load Cart from cookies | storage', payload: cookieProducts});
		} catch (error) {
			dispatch({type: 'Cart - Load Cart from cookies | storage', payload: []});
		}
	}, []);
	

	useEffect(() => {
		if (state.cart.length > 0) Cookies.set('cart', JSON.stringify(state.cart));
	}, [state.cart]);
	

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

	const updateCartQuantity = ( product: ICartProduct ) => {
		dispatch({type: 'Cart - Change cart product quantity', payload: product});
	};

	return (
		<CartContext.Provider value={{
			...state,
			addProductToCart,
			updateCartQuantity
		}}>
			{ children }
		</CartContext.Provider>
	);
};