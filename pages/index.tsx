import { NextPage } from 'next';

import { Typography } from '@mui/material';
import { ShopLayout } from '@/components/layouts';

const Home: NextPage = function Home() {
	return (
		<ShopLayout title='Nikola-Shop - Home' pageDescription='Find the best products from Nikola Shop'>
			<Typography variant='h1' component='h1'>Shop</Typography>
			<Typography variant='h2' sx={{ mb: 1}}>All products</Typography>
		</ShopLayout>
	);
};

export default Home;
