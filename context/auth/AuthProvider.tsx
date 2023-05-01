import { useEffect, useReducer, PropsWithChildren } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { AuthContext, authReducer, registerResponse } from './';

import axios from 'axios';
import Cookie from 'js-cookie';

import { nikolaApi } from '@/api';
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
	const { data, status } = useSession();

	const router = useRouter();

	useEffect(() => {
		if(status === 'authenticated') {
			console.log(data?.user);
			dispatch({type: 'Auth - Login', payload: data?.user as IUser});
		}
	}, [status, data]);
	

	// useEffect(() => {
	// 	checkToken();
	// }, []);

	const checkToken = async () => {
		const cookiesToken = Cookie.get('token');

		if(!cookiesToken) return; 

		try {
			const { data } = await nikolaApi.get('/user/validate-token');
			const { token, user } = data;

			Cookie.set('token', token);
			dispatch({type: 'Auth - Login', payload: user});

		} catch (error) {
			Cookie.remove('token');
		}
	};

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

	const registerUser = async (name: string, email: string, password: string):Promise<registerResponse> => {
		try {
			const { data } = await nikolaApi.post('/user/register', { name, email, password });
			const { token, user } = data;

			Cookie.set('token', token);
			dispatch({type: 'Auth - Login', payload: user});

			return { hasError: false};
		} catch (error) {
			if(axios.isAxiosError(error)) {
				return {
					hasError: true,
					message: error.response?.data.message
				};
			}

			return {
				hasError: true,
				message: 'Could not register user, try again later'
			};
		}
	};

	const logoutUser = () => {
		Cookie.remove('cart');
		Cookie.remove('firstName');
		Cookie.remove('lastName');
		Cookie.remove('address');
		Cookie.remove('address2');
		Cookie.remove('zip');
		Cookie.remove('city');
		Cookie.remove('country');
		Cookie.remove('phone');

		signOut();
		// router.reload();
		// Cookie.remove('token');
	};

	return (
		<AuthContext.Provider value={{
			...state,
			loginUser,
			registerUser,
			logoutUser
		}}>
			{ children }
		</AuthContext.Provider>
	);
};