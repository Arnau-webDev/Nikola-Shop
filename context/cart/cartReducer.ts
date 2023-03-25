import { CartState } from './';
import { ICartProduct } from '@/interfaces';

type CartActionType = 
| { type: 'Cart - Load Cart from cookies | storage', payload: ICartProduct[] }
| { type: 'Cart - Update products in cart', payload: ICartProduct[] }
| { type: 'Cart - Change cart product quantity', payload: ICartProduct }
| { type: 'Cart - Remove product in cart', payload: ICartProduct }

export const cartReducer = ( state: CartState, action: CartActionType): CartState => {

	switch (action.type) {
	case 'Cart - Load Cart from cookies | storage':
		return {
			...state,
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
	default:
		return state;
	}

};