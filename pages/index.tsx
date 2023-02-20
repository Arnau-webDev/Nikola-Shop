import { NextPage } from 'next';

import { Typography } from '@mui/material';
import { ShopLayout } from '@/components/layouts';

import { initialData } from '../database/products';
import { ProductList } from '@/components/products';

const Home: NextPage = function Home() {
	return (
		<ShopLayout title='Nikola-Shop - Home' pageDescription='Find the best products from Nikola Shop'>
			<Typography variant='h1' component='h1'>Shop</Typography>
			<Typography variant='h2' sx={{ mb: 1}}>All products</Typography>

			<ProductList products={initialData.products as any} />
		</ShopLayout>
	);
};

export default Home;
