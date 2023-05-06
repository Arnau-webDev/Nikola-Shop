import { GetServerSideProps, NextPage } from 'next';
import { getToken } from 'next-auth/jwt';
import { ShopLayout } from '@/components/layouts';
import { CartList, OrderSummary } from '@/components/cart';

import { IOrder } from '@/interfaces';
import { dbOrders } from '@/database';

import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

interface Props {
	order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
	console.log(order);

	const { shippingAddress } = order;

	return (
		<ShopLayout title="Summary - Order summary" pageDescription="Order summary">
			<Typography variant='h1' component='h1'>Order {order._id}</Typography>

			{  order.isPaid 
				? ( <Chip  sx={{ my: 2}} label='Order is Paid' variant='outlined' color='success' icon={<CreditScoreOutlined />} />) 
				: ( <Chip  sx={{ my: 2}} label='Order not Paid' variant='outlined' color='error' icon={<CreditCardOffOutlined />} />)
			}

			<Grid container sx={{ mt: 3 }}>
				<Grid item xs={12} sm={12} md={6}>
					<CartList products={  order.orderItems } />
				</Grid>
				<Grid item md={1} sx={{ margin: {xs: 2, md: 0}}}></Grid>
				<Grid item xs={12} sm={12} md={5}>
					<Card className='summary-card'>
						<CardContent>
							<Typography variant='h2'>Summary ({order.numberOfItems} {order.numberOfItems > 1 ? 'items' : 'item'})</Typography>
							<Divider sx={{my: 1}} />

							<Grid container>
								<Grid item xs={10}>
									<Typography variant='subtitle1'>Delivery Address</Typography>
									<Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
									<Typography>{ shippingAddress.address } { shippingAddress.address2 ? `, ${ shippingAddress.address2 }`: '' }</Typography>
									<Typography>{ shippingAddress.city }, { shippingAddress.zip }</Typography>
									<Typography>{ shippingAddress.country }</Typography>
									<Typography>{ shippingAddress.phone }</Typography>
								</Grid>
							</Grid>

							<Divider sx={{my: 2}} />

							<OrderSummary 
								orderValues={{
									numberOfItems: order.numberOfItems,
									subTotal: order.subTotal,
									total: order.total,
									tax: order.tax,
								}} 
							/>

							<Box sx={{ mt: 3 }} display="flex" flexDirection='column'>
								{
									order.isPaid
										? (
											<Chip 
												sx={{ my: 2 }}
												label="Orden ya fue pagada"
												variant='outlined'
												color="success"
												icon={ <CreditScoreOutlined /> }
											/>

										):(
											<h2>Go to Payment</h2>
										)
								}
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
	const { id = '' } = query; 
	const sessionToken: any = await getToken({ req });

	if(!sessionToken) {
		return {
			redirect: {
				destination: `/auth/login?p=/orders/${id}`,
				permanent: false,
			}
		};
	}

	const order = await dbOrders.getOrderById(id.toString());

	if(!order) {
		return {
			redirect: {
				destination: '/orders/history',
				permanent: false,
			}
		};
	}

	if( order.user !== sessionToken.user._id) {
		return {
			redirect: {
				destination: '/orders/history',
				permanent: false,
			}
		};
	}

	return {
		props: {
			order
		}
	};
};

export default OrderPage;