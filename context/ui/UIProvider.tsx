import { PropsWithChildren, useReducer } from 'react';
import { UIContext, uiReducer } from './';

export interface UIState {
    isMenuOpen: boolean
}

const UI_INITIAL_STATE: UIState = {
	isMenuOpen: false
};

export const UIProvider: React.FC<PropsWithChildren> = ({ children }) => {

	const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

	const toggleSideMenu = () => { dispatch({type: 'UI - Toggle Menu'});};

	return (
		<UIContext.Provider value={{
			...state,
			toggleSideMenu
		}}>
			{ children }
		</UIContext.Provider>
	);
};