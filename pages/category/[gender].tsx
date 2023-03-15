import { useEffect } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Typography } from '@mui/material';
import { ShopLayout } from '@/components/layouts';

import { useProducts } from '@/hooks';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui/FullScreenLoading';

const validGenders = ['men', 'kid', 'women'];


const ProductByGenderPage = () => {

	const router = useRouter();
  
	const gender = (router.query.gender as string) ?? '';
  
	useEffect(() => {
		if (!validGenders.includes(gender)) {
			router.push('/');
		}
	}, [gender]);
  
	const { products, isLoading } = useProducts(`/products?gender=${gender}`);

	const genderCapitalized = gender.charAt(0).toLocaleUpperCase() + gender.slice(1);

	console.log(genderCapitalized);
  
	return (
  
		<ShopLayout
			title={`Nikola-Shop - ${genderCapitalized}`}
			pageDescription={'Find the best products from Nikola Shop' + genderCapitalized}
		>
			<Typography variant="h1">
				{'Shop'}
			</Typography>
  
			<Typography variant="h2" sx={{ mb: 1 }}>
				{'Products for ' + (genderCapitalized === 'Kid' ? `${genderCapitalized}s` : genderCapitalized) }
			</Typography>
  
			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
  
		</ShopLayout>
  
	);
  
};
  
export default ProductByGenderPage;
