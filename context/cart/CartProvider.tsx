import { PropsWithChildren, useEffect, useReducer } from 'react';
import { CartContext, cartReducer } from './';
import { ICartProduct, IOrder, ShippingAddress } from '@/interfaces';

import Cookie from 'js-cookie';
import { nikolaApi } from '@/api';
export interface CartState {
	isLoaded: boolean;
    cart: ICartProduct[];
	numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
	shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
	isLoaded: false,
	cart: [],
	numberOfItems: 0,
	subTotal: 0,
	tax: 0,
	total: 0,
	shippingAddress: undefined
};

export const CartProvider: React.FC<PropsWithChildren> = ({ children }) => {

	const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

	useEffect(() => {
		try {
			const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
			dispatch({type: 'Cart - Load Cart from cookies | storage', payload: cookieProducts});
		} catch (error) {
			dispatch({type: 'Cart - Load Cart from cookies | storage', payload: []});
		}
	}, []);

	useEffect(() => {
		if(Cookie.get('firstName')) {
			const shippingAddress: ShippingAddress = {
				firstName: Cookie.get('firstName') || '',
				lastName: Cookie.get('lastName') || '',
				address: Cookie.get('address') || '',
				address2: Cookie.get('address2') || '',
				zip: Cookie.get('zip') || '',
				city: Cookie.get('city') || '',
				country: Cookie.get('country') || '',
				phone: Cookie.get('phone') || '',
			};
			dispatch({type: 'Cart - Load Address from Cookies', payload: shippingAddress});
		}
	}, []);

	useEffect(() => {
		if (state.cart.length > 0) Cookie.set('cart', JSON.stringify(state.cart));
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

	const updateAddress = (address: ShippingAddress) => {

		Cookie.set('firstName', address.firstName);
		Cookie.set('lastName', address.lastName);
		Cookie.set('address', address.address);
		Cookie.set('address2', address.address2 || '');
		Cookie.set('zip', address.zip);
		Cookie.set('city', address.city);
		Cookie.set('country', address.country);
		Cookie.set('phone', address.phone);

		dispatch({type: 'Cart - Update Address', payload: address});
	};

	const createOrder = async () => {

		if(!state.shippingAddress) {
			throw new Error('No shipping address available');
		}

		const body: IOrder = {
			orderItems: state.cart.map( product => ({
				...product,
				size: product.size!
			})),
			shippingAddress: state.shippingAddress,
			numberOfItems: state.numberOfItems,
			subTotal: state.subTotal,
			tax: state.tax,
			total: state.total,
			isPaid: false,
		};

		try {
			const { data } = await nikolaApi.post('/orders', body);

			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<CartContext.Provider value={{
			...state,
			addProductToCart,
			updateCartQuantity,
			removeCartProduct,
			updateAddress,
			createOrder,
		}}>
			{ children }
		</CartContext.Provider>
	);
};