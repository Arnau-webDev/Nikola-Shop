import { PropsWithChildren, useReducer } from 'react';
import { CartContext, cartReducer } from './';
import { ICartProduct } from '@/interfaces';

export interface CartState {
    cart: ICartProduct
}

const CART_INITIAL_STATE: CartState = {
	cart: []
};

export const CartProvider: React.FC<PropsWithChildren> = ({ children }) => {

	const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

	return (
		<CartContext.Provider value={{
			...state
		}}>
			{ children }
		</CartContext.Provider>
	);
};