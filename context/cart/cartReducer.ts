import { CartState } from './';
import { ICartProduct, ShippingAddress } from '@/interfaces';

type CartActionType = 
| { type: 'Cart - Load Cart from cookies | storage', payload: ICartProduct[] }
| { type: 'Cart - Update products in cart', payload: ICartProduct[] }
| { type: 'Cart - Change cart product quantity', payload: ICartProduct }
| { type: 'Cart - Remove product in cart', payload: ICartProduct }
| { type: 'Cart - Load Address from Cookies', payload: ShippingAddress }
| { type: 'Cart - Update Address', payload: ShippingAddress }
| { 
	type: 'Cart - Update order summary', 
	payload: {
		numberOfItems: number;
		subTotal: number;
		tax: number;
		total: number;
	} 
}
| { type: 'Cart - Order complete'};

export const cartReducer = ( state: CartState, action: CartActionType): CartState => {

	switch (action.type) {
	case 'Cart - Load Cart from cookies | storage':
		return {
			...state,
			isLoaded: true,
			cart: [...action.payload]
		};
	case 'Cart - Update products in cart':
		return {
			...state,
			cart: [...action.payload]
		};
	case 'Cart - Change cart product quantity':
		return {
			...state,
			cart: state.cart.map(product => {
				if(product._id !== action.payload._id) return product;
				if(product.size !== action.payload.size) return product;

				return action.payload;
			})
		};
	case 'Cart - Remove product in cart':
		return {
			...state,
			cart: state.cart.filter(product => {
				if(product._id !== action.payload._id) return true;
				if(product.size !== action.payload.size) return true;

				return false;
			})
		};
	case 'Cart - Update order summary':
		return {
			...state,
			...action.payload
		};
	case 'Cart - Load Address from Cookies':
	case 'Cart - Update Address':
		return {
			...state,
			shippingAddress: action.payload
		};
	case 'Cart - Order complete':
		return {
			...state,
			cart: [],
			numberOfItems: 0,
			subTotal: 0,
			tax: 0,
			total: 0
		};
	
	default:
		return state;
	}

};