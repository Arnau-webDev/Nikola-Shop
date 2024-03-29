import { GetServerSideProps, NextPage } from 'next';

import { AdminLayout } from '@/components/layouts';
import { CartList, OrderSummary } from '@/components/cart';

import { IOrder } from '@/interfaces';
import { dbOrders } from '@/database';

import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

interface Props {
	order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
	const { shippingAddress } = order;

	return (
		<AdminLayout title="Order summary" subtitle={`OrderId: ${order._id}`} icon={<AirplaneTicketOutlined />}>
			{  order.isPaid 
				? ( <Chip  sx={{ my: 2}} label='Order is Paid' variant='outlined' color='success' icon={<CreditScoreOutlined />} />) 
				: ( <Chip  sx={{ my: 2}} label='Order not Paid' variant='outlined' color='error' icon={<CreditCardOffOutlined />} />)
			}

			<Grid container sx={{ mt: 3 }} className='fadeIn'>
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
								isEditable={false} 
							/>

							<Box sx={{ mt: 3 }} display="flex" flexDirection='column'>

								<Box display={'flex'} flexDirection={'column'}>
									{
										order.isPaid
											? (
												<Chip 
													sx={{ my: 2, flex: 1 }}
													label="Order is Paid"
													variant='outlined'
													color="success"
													icon={ <CreditScoreOutlined /> }
												/>

											): (
												<Chip 
													sx={{ my: 2, flex: 1 }}
													label="Order is not Paid"
													variant='outlined'
													color="error"
													icon={ <CreditScoreOutlined /> }
												/> 
											)
									}
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
	const { id = '' } = query; 

	const order = await dbOrders.getOrderById(id.toString());

	if(!order) {
		return {
			redirect: {
				destination: '/admin/orders',
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