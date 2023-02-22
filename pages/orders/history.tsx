import NextLink from 'next/link';

import { ShopLayout } from '@/components/layouts';

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Typography, Grid, Chip, Link, Box } from '@mui/material';

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
					: <Chip color="error" label="Is Not Paid" variant='outlined' />
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
				<NextLink href={`/orders/${ params.row.id }`} passHref legacyBehavior>
					<Link underline='always' color='secondary'>
                        View Order
					</Link>
				</NextLink>
			);
		}
	}
];

const rows = [
	{ id: 1, paid: true, fullname: 'Fernando Herrera' },
	{ id: 2, paid: false, fullname: 'Melissa Flores' },
	{ id: 3, paid: true, fullname: 'Hernando Vallejo' },
	{ id: 4, paid: false, fullname: 'Emin Reyes' },
	{ id: 5, paid: false, fullname: 'Eduardo Rios' },
	{ id: 6, paid: true, fullname: 'Natalia Herrera' },
];

const HistoryPage = () => {
	return (
		<ShopLayout title="Order History" pageDescription="Order Hystory from client">
			<Typography variant='h1' component='h1'>Order History</Typography>

			<Grid container sx={{ mt: 3}}>
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

export default HistoryPage;