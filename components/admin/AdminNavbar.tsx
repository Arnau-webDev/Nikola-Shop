import { useContext } from 'react';
import NextLink from 'next/link';

import { UIContext } from '@/context';

import { AppBar, Link, Toolbar, Typography, Box, Button } from '@mui/material';


export const AdminNavbar: React.FC = () => {

	const { toggleSideMenu } = useContext(UIContext);


	return (
		<AppBar>
			<Toolbar>
				<NextLink href={'/'} passHref legacyBehavior>
					<Link display={'flex'} alignItems={'center'}>
						<Typography variant="h6">Nikola |</Typography>
						<Typography sx={{ marginLeft: 0.5}}>Shop</Typography>
					</Link>
				</NextLink>

				<Box flex={1}/>

				<Button onClick={toggleSideMenu}>Menu</Button>
			</Toolbar>
		</AppBar>
	);
};
