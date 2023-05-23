
import { CategoryOutlined } from '@mui/icons-material';
import { CardMedia, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useSWR from 'swr';

import { AdminLayout } from '../../components/layouts';
import { IProduct } from '../../interfaces';


const columns:GridColDef[] = [
	{ 
		field: 'img', 
		headerName: 'Photo' ,
		renderCell: ({ row }) => {
			return (
				<a href={`/product/${row.slug}`} target='blank' rel='noreferrer'>
					<CardMedia 
						component='img'
						alt={row.title}
						className='fadeIn'
						image={ `/products/${row.img}`}
					/>
				</a>
			);
		}
	},
	{ field: 'title', headerName: 'Title', width: 250 },
	{ field: 'gender', headerName: 'Gender' },
	{ field: 'type', headerName: 'Type' },
	{ field: 'inStock', headerName: 'In Stock' },
	{ field: 'price', headerName: 'Price' },
	{ field: 'sizes', headerName: 'Sizes', width: 250 },

];

const ProductsPage = () => {

	const { data, error } = useSWR<IProduct[]>('/api/admin/products');

	if ( !data && !error ) return (<></>);
    
	const rows = data!.map( product => ({
		id: product._id,
		img: product.images[0],
		title: product.title,
		gender: product.gender,
		type: product.type,
		inStock: product.inStock,
		price: product.price,
		sizes: product.sizes.join(', '),
		slug: product.slug,
	}));


	return (
		<AdminLayout 
			title={`Products (${data?.length})`} 
			subtitle={'Handle products'}
			icon={ <CategoryOutlined /> }
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

export default ProductsPage;