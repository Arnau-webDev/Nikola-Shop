import { createContext } from 'react';

import { IUser } from '@/interfaces';

interface ContextProps {
    isLoggedIn: boolean;
    user?: IUser;
    loginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<registerResponse>
}
export interface registerResponse {
    hasError: boolean,
    message?: string
}

export const AuthContext = createContext({} as ContextProps);