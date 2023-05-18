
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useSWR from 'swr';

import { AdminLayout } from '../../components/layouts';
import { IOrder, IUser } from '../../interfaces';


const columns:GridColDef[] = [
	{ field: 'id', headerName: 'Order ID', width: 250 },
	{ field: 'email', headerName: 'Email', width: 250 },
	{ field: 'name', headerName: 'Complete Name', width: 300 },
	{ field: 'total', headerName: 'Total amount', width: 150 },
	{
		field: 'isPaid',
		headerName: 'Paid',
		renderCell: ({ row }: any) => {
			return row.isPaid
				? ( <Chip variant='outlined' label="Paid" color="success" /> )
				: ( <Chip variant='outlined' label="Not Paid" color="error" /> );
		},
		width: 120
	},
	{ field: 'noProducts', headerName: 'No.Products', align: 'center', width: 120 },
	{
		field: 'check',
		headerName: 'View order',
		renderCell: ({ row }: any) => {
			return (
				<a href={ `/admin/orders/${ row.id }` } target="_blank" rel="noreferrer" >
                    View order
				</a>
			);
		},
		width: 120
	},
	{ field: 'createdAt', headerName: 'Created at', width: 200 },

];

const OrdersPage = () => {

	const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

	if ( !data && !error ) return (<></>);
    
	const rows = data!.map( order => ({
		id    : order._id,
		email : (order.user as IUser).email,
		name  : (order.user as IUser).name,
		total : order.total,
		isPaid: order.isPaid,
		noProducts: order.numberOfItems,
		createdAt: order.createdAt,
	}));


	return (
		<AdminLayout 
			title={'Orders'} 
			subtitle={'Handle orders'}
			icon={ <ConfirmationNumberOutlined /> }
		>
			<Grid container className='fadeIn' marginTop={2}>
				<Grid item xs={12} sx={{ height:650, width: '100%' }}>
					<DataGrid 
						rows={ rows }
						columns={ columns }
						pageSize={ 10 }
						rowsPerPageOptions={ [10] }
					/>

				</Grid>
			</Grid>
        
		</AdminLayout>
	);
};

export default OrdersPage;