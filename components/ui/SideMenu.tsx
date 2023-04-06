import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { AuthContext, UIContext } from '@/context';

import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from '@mui/icons-material';

export const SideMenu = () => {

	const router = useRouter();
	const { isLoggedIn, user } = useContext(AuthContext);
	const {isMenuOpen, toggleSideMenu} = useContext(UIContext);

	const [searchTerm, setSearchTerm] = useState('');

	const onSearchSubmit = () => {
		if(searchTerm.trim().length === 0) return;

		navigateTo(`/search/${searchTerm.trim()}`);
	};

	const navigateTo = (url: string) => {
		toggleSideMenu();
		router.push(url);
	};

	return (
		<Drawer
			open={ isMenuOpen }
			anchor='right'
			sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
			onClose={ toggleSideMenu }
		>
			<Box sx={{ width: 250, paddingTop: 5 }}>
            
				<List>

					<ListItem>
						<Input
							autoFocus
							value={searchTerm}
							onChange={ (e) => setSearchTerm(e.target.value)}
							onKeyPress={ (e) => e.key === 'Enter' ? onSearchSubmit() : null}
							type='text'
							placeholder="Search..."
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={onSearchSubmit}
									>
										<SearchOutlined />
									</IconButton>
								</InputAdornment>
							}
						/>
					</ListItem>

					{ isLoggedIn && (
						<>
							<ListItem button>
								<ListItemIcon>
									<AccountCircleOutlined/>
								</ListItemIcon>
								<ListItemText primary={'Profile'} />
							</ListItem>

							<ListItem button>
								<ListItemIcon>
									<ConfirmationNumberOutlined/>
								</ListItemIcon>
								<ListItemText primary={'My Orders'} />
							</ListItem>
						</>
					)}


					<ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/men')}>
						<ListItemIcon>
							<MaleOutlined/>
						</ListItemIcon>
						<ListItemText primary={'Men'} />
					</ListItem>

					<ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/women')}>
						<ListItemIcon>
							<FemaleOutlined/>
						</ListItemIcon>
						<ListItemText primary={'Women'} />
					</ListItem>

					<ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/kid')}>
						<ListItemIcon>
							<EscalatorWarningOutlined/>
						</ListItemIcon>
						<ListItemText primary={'Kids'} />
					</ListItem>


					{ isLoggedIn ? 
						(
							<ListItem button>
								<ListItemIcon>
									<LoginOutlined/>
								</ListItemIcon>
								<ListItemText primary={'Logout'} />
							</ListItem>
						) : (
							<ListItem button>
								<ListItemIcon>
									<VpnKeyOutlined/>
								</ListItemIcon>
								<ListItemText primary={'Login'} />
							</ListItem>
						)
					}

					{
						isLoggedIn && user?.role === 'admin' ? (
							<>
								<Divider />
								<ListSubheader>Admin Panel</ListSubheader>

								<ListItem button>
									<ListItemIcon>
										<CategoryOutlined/>
									</ListItemIcon>
									<ListItemText primary={'Products'} />
								</ListItem>
								<ListItem button>
									<ListItemIcon>
										<ConfirmationNumberOutlined/>
									</ListItemIcon>
									<ListItemText primary={'Orders'} />
								</ListItem>

								<ListItem button>
									<ListItemIcon>
										<AdminPanelSettings/>
									</ListItemIcon>
									<ListItemText primary={'Users'} />
								</ListItem>
							</>
						) : null
					}
				</List>
			</Box>
		</Drawer>
	);
};