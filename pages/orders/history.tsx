import { GetServerSideProps, NextPage } from 'next';
import { getToken } from 'next-auth/jwt';
import NextLink from 'next/link';

import { ShopLayout } from '@/components/layouts';

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Typography, Grid, Chip, Link } from '@mui/material';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'ID', width: 100 },
	{ field: 'fullname', headerName: 'Complete Name', width: 300 },

	{
		field: 'Paid',
		headerName: 'Payment',
		description: 'Muestra información si está pagada la orden o no',
		width: 200,
		renderCell: (params: GridRenderCellParams) => {
			return (
				params.row.paid
					? <Chip color="success" label="Is Paid" variant='outlined' />
					: <Chip color="error" label="Not Paid" variant='outlined' />
			);
		}
	},
	{
		field: 'Order',
		headerName: 'View Order',
		width: 200,
		sortable: false,
		renderCell: (params: GridRenderCellParams) => {
			return (
				<NextLink href={`/orders/${ params.row.orderId }`} passHref legacyBehavior>
					<Link underline='always' color='secondary'>
                        View Order
					</Link>
				</NextLink>
			);
		}
	}
];

interface Props {
	orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({orders}) => {

	const rows = orders.map((order, index) => (
		{
			id: index + 1,
			paid: order.isPaid,
			fullname: order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName,
			orderId: order._id
		}
	));

	return (
		<ShopLayout title="Order History" pageDescription="Order Hystory from client">
			<Typography variant='h1' component='h1'>Order History</Typography>

			<Grid container sx={{ mt: 3}} className='fadeIn'>
				<Grid item xs={12} sx={{ height: 650, width: '100%'}}>
					<DataGrid 
						rows={ rows }
						columns={ columns }
						pageSize={ 10 }
						rowsPerPageOptions={[10]}
					/>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

	const sessionToken: any = await getToken({req});

	if(!sessionToken) {
		return {
			redirect: {
				destination: '/auth/login?p=/orders/history',
				permanent: false
			}
		};
	}

	const orders = await dbOrders.getOrdersByUser(sessionToken.user._id);

	return {
		props: {
			orders,
		}
	};
};

export default HistoryPage;