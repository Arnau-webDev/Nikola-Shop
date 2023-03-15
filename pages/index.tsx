import { NextPage } from 'next';

import { Typography } from '@mui/material';
import { ShopLayout } from '@/components/layouts';

import { useProducts } from '@/hooks';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui/FullScreenLoading';


const Home: NextPage = function Home() {

	const { products, isLoading } = useProducts('/products');

	return (
		<ShopLayout title='Nikola-Shop - Home' pageDescription='Find the best products from Nikola Shop'>
			<Typography variant='h1' component='h1'>Shop</Typography>
			<Typography variant='h2' sx={{ mb: 1}}>All products</Typography>

			{ 
				isLoading
					? <FullScreenLoading />
					: <ProductList products={products} />
			}
			
		</ShopLayout>
	);
};

export default Home;
