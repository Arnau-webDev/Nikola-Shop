import { CartList, OrderSummary } from '@/components/cart';
import { ShopLayout } from '@/components/layouts';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';

const CardPage = () => {
	return (
		<ShopLayout title="card - 3" pageDescription="Shopping Card">
			<Typography variant='h1' component='h1'>Cart</Typography>

			<Grid container sx={{ mt: 3 }}>
				<Grid item xs={12} sm={12} md={6}>
					<CartList isEditable={true} />
				</Grid>
				<Grid item md={1} sx={{ margin: {xs: 2, md: 0}}}></Grid>
				<Grid item xs={12} sm={12} md={5}>
					<Card className='summary-card'>
						<CardContent>
							<Typography variant='h2'>Order</Typography>
							<Divider sx={{my: 1}} />

							{<OrderSummary />}

							<Box sx={{ mt: 3}}>
								<Button color='secondary' className='circular-btn' fullWidth >
                                    Checkout
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default CardPage;