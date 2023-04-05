import { PropsWithChildren, useReducer } from 'react';
import { AuthContext, authReducer } from './';

import { IUser } from '@/interfaces';

export interface AuthState {
    isLoggedIn: boolean,
    user?: IUser
}

const Auth_INITIAL_STATE: AuthState = {
	isLoggedIn: false,
	user: undefined
};

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {

	const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);

	return (
		<AuthContext.Provider value={{
			...state
		}}>
			{ children }
		</AuthContext.Provider>
	);
};