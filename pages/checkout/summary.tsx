import NextLink from 'next/link';
import { ShopLayout } from '@/components/layouts';
import { CartList, OrderSummary } from '@/components/cart';

import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';

const SummaryPage = () => {
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
							<Typography variant='h2'>Summary (3 items)</Typography>
							<Divider sx={{my: 1}} />

							<Grid container>
								<Grid item xs={10}>
									<Typography variant='subtitle1'>Delivery Address</Typography>
									<Typography>Arnau MQ</Typography>
									<Typography>333 Somewhere</Typography>
									<Typography>Stittsvile, HYA 235</Typography>
									<Typography>Canada</Typography>
									<Typography>+1 27462734263</Typography>
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

							<Box sx={{ mt: 3}}>
								<Button color='secondary' className='circular-btn' fullWidth >
                                    Confirm Order
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default SummaryPage;