import { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import { Box, Typography } from '@mui/material';
import { ShopLayout } from '@/components/layouts';

import { ProductList } from '@/components/products';

import { IProduct } from '../../interfaces/products';
import { dbProducts } from '@/database';

interface Props {
    products: IProduct[],
    foundProducts: boolean,
    query: string
}

const SearchPage: NextPage<Props> = function SearchPage({products, foundProducts, query}) {

	return (
		<ShopLayout title='Nikola-Shop - Search' pageDescription='Find the best products from Nikola Shop'>
			<Typography variant='h1' component='h1'>Search Products</Typography>
			
			{
				foundProducts
					? <Typography variant='h2' sx={{ mb: 1}} textTransform='capitalize'>Keyword: { query }</Typography>
					: (
						<Box display='flex'>
							<Typography variant='h2' sx={{ mb: 1}}>No products found based on your search: </Typography>
							<Typography variant='h2' sx={{ mb: 1, ml: 1}} color='secondary' textTransform='capitalize'>{query}</Typography>
						</Box>
					)
			}

			<ProductList products={products} />
			
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const { query = '' } = params as { query: string };

	if(query.length === 0) {
		return {
			redirect: {
				destination: '/',
				permanent: true
			}
		};
	}

	let products = await dbProducts.getProductsBySearchTerm(query);  
	const foundProducts = products.length > 0;

	if(!foundProducts) {
		products = await dbProducts.getProductsBySearchTerm('shirt');
	}

	return {
		props: {
			products,
			foundProducts,
			query
		}
	};
};

export default SearchPage;
