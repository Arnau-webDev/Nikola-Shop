import { PropsWithChildren, useReducer } from 'react';
import { AuthContext, authReducer } from './';

import { IUser } from '@/interfaces';
import { nikolaApi } from '@/api';
import Cookie from 'js-cookie';

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

	const loginUser = async (email: string, password: string): Promise<boolean> => {
		try {
			const { data } = await nikolaApi.post('/user/login', { email, password });
			const { token, user } = data;

			Cookie.set('token', token);
			dispatch({type: 'Auth - Login', payload: user});
			return true;
            
		} catch (error) {
			console.log(error);
			return false;
		}
	};

	return (
		<AuthContext.Provider value={{
			...state,
			loginUser
		}}>
			{ children }
		</AuthContext.Provider>
	);
};