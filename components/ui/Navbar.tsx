import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { CartContext, UIContext } from '@/context';

import { AppBar, Link, Toolbar, Typography, Box, Button, IconButton, Badge, Input, InputAdornment } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';


export const Navbar: React.FC = () => {

	const { query, push } = useRouter();
	const activeGenderPage = query.gender;

	const { toggleSideMenu } = useContext(UIContext);
	const { numberOfItems } = useContext(CartContext);

	const [searchTerm, setSearchTerm] = useState('');
	const [isSearchVisible, setIsSearchVisible] = useState(false);

	const onSearchTerm = () => {
		if( searchTerm.trim().length === 0 ) return;
		push(`/search/${ searchTerm }`);
	};

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

				<Box sx={{ display: {xs: 'none', md: 'block'}}}>
					<NextLink href={'/category/men'} passHref legacyBehavior>
						<Link>
							<Button color={activeGenderPage === 'men' ? 'primary' : 'info'}>Men</Button>
						</Link>
					</NextLink>
					<NextLink href={'/category/women'} passHref legacyBehavior>
						<Link>
							<Button color={activeGenderPage === 'women' ? 'primary' : 'info'}>Women</Button>
						</Link>
					</NextLink>
					<NextLink href={'/category/kid'} passHref legacyBehavior>
						<Link>
							<Button color={activeGenderPage === 'kid' ? 'primary' : 'info'}>Kids</Button>
						</Link>
					</NextLink>
				</Box>

				<Box flex={1}/>

				{/* Medium or big screens */}
				{
					isSearchVisible 
						? (
							<Input
								sx={{ display: { xs: 'none', sm: 'flex' } }}
								className='fadeIn'
								autoFocus
								value={ searchTerm }
								onChange={ (e) => setSearchTerm( e.target.value ) }
								onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
								type='text'
								placeholder="Buscar..."
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											onClick={ () => setIsSearchVisible(false) }
										>
											<ClearOutlined />
										</IconButton>
									</InputAdornment>
								}
							/>
						)
						: 
						(
							<IconButton 
								onClick={ () => setIsSearchVisible(true) }
								className="fadeIn"
								sx={{ display: { xs: 'none', sm: 'flex' } }}
							>
								<SearchOutlined />
							</IconButton>
						)
				}

				{/* Small screens */}
				<IconButton
					sx={{ display: { xs: 'flex', sm: 'none' } }}
					onClick={ toggleSideMenu }
				>
					<SearchOutlined />
				</IconButton>

				<NextLink href={'/cart'} passHref legacyBehavior>
					<Link>
						<IconButton>
							<Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color='secondary'>
								<ShoppingCartOutlined />
							</Badge>
						</IconButton>
					</Link>
				</NextLink>

				<Button onClick={toggleSideMenu}>Menu</Button>
			</Toolbar>
		</AppBar>
	);
};
