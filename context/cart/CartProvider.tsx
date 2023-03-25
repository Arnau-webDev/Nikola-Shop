import { PropsWithChildren, useEffect, useReducer } from 'react';
import { CartContext, cartReducer } from './';
import { ICartProduct } from '@/interfaces';

import Cookies from 'js-cookie';

export interface CartState {
    cart: ICartProduct[];
	numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
}

const CART_INITIAL_STATE: CartState = {
	cart: [],
	numberOfItems: 0,
	subTotal: 0,
	tax: 0,
	total: 0,
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

	useEffect(() => {
		const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
		const totalPriceOfItems = state.cart.reduce((prev, current) => ( current.price * current.quantity ) + prev, 0);
		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE) || 0;

		const orderSummary = {
			numberOfItems,
			subTotal: totalPriceOfItems,
			tax: totalPriceOfItems * taxRate,
			total: totalPriceOfItems * ( taxRate + 1)
		};

		dispatch({type: 'Cart - Update order summary', payload: orderSummary});

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

	const removeCartProduct = ( product: ICartProduct ) => {
		dispatch({type: 'Cart - Remove product in cart', payload: product});
	};

	return (
		<CartContext.Provider value={{
			...state,
			addProductToCart,
			updateCartQuantity,
			removeCartProduct
		}}>
			{ children }
		</CartContext.Provider>
	);
};