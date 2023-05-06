import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Cookies from 'js-cookie';

import { CartContext } from '@/context';
import { ShopLayout } from '@/components/layouts';
import { CartList, OrderSummary } from '@/components/cart';

import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { countries } from '@/utils';

const SummaryPage = () => {

	const router = useRouter();
	const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);
	const [isPosting, setIsPosting] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		if ( !Cookies.get('firstName') ) {
			router.push('/checkout/address');
		}
	}, [ router ]);
	
	const onCreateOrder = async () => {
		setIsPosting(true);
		const { hasError, message, orderId } = await createOrder();

		if(hasError) {
			setIsPosting(false);
			setErrorMessage(message);
			return;
		}

		router.replace(`/orders/${orderId}`);
		setIsPosting(false);
	};

	if(!shippingAddress) return (<></>);

	const { firstName, lastName, address, address2 = '', city, country, phone, zip } = shippingAddress;

	return (
		<ShopLayout title="Order Summary" pageDescription="Order summary">
			<Typography variant='h1' component='h1'>Order Summary</Typography>

			<Grid container sx={{ mt: 3 }}>
				<Grid item xs={12} sm={12} md={6}>
					<CartList  />
				</Grid>
				<Grid item md={1} sx={{ margin: {xs: 2, md: 0}}}></Grid>
				<Grid item xs={12} sm={12} md={5}>
					<Card className='summary-card'>
						<CardContent>
							<Typography variant='h2'>Summary ({numberOfItems} {numberOfItems === 1 ? 'product' : 'products'})</Typography>
							<Divider sx={{my: 1}} />

							<Grid container>
								<Grid item xs={10}>
									<Typography>{ firstName } { lastName }</Typography>
									<Typography>{ address }{ address2 ? `, ${address2}` : ''  } </Typography>
									<Typography>{ city }, { zip }</Typography>
									<Typography>{ countries.find( c => c.code === country )?.name }</Typography>
									<Typography>{ phone }</Typography>
								</Grid>

								<Grid item xs={2}>
									<Box display='flex' justifyContent='end'>
										<NextLink href='/checkout/address' passHref legacyBehavior>
											<Link underline='always' color='secondary'>Edit</Link>
										</NextLink>
									</Box>
								</Grid>
							</Grid>

							<Divider sx={{my: 2}} />

							<OrderSummary />

							<Box sx={{ mt: 3}} display="flex" flexDirection="column">
								<Button color='secondary' className='circular-btn' fullWidth onClick={onCreateOrder} disabled={isPosting}>
                                    Confirm Order
								</Button>
								
								<Chip color='error' label={ errorMessage } sx={{ display: errorMessage ? 'flex' : 'none', marginTop: 2}} />
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default SummaryPage;