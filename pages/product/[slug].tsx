import { GetServerSideProps, NextPage } from 'next';
import { ProductSizeSelector, ProductSlideShow } from '@/components/products';
import { ItemCounter } from '@/components/ui/ItemCounter';
import { ShopLayout } from '@/components/layouts';

import { IProduct } from '@/interfaces';

import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { dbProducts } from '@/database';


interface Props {
	product: IProduct
}


const ProductPage: NextPage<Props> = ({ product }) => {

	return (
		<ShopLayout title={product.title} pageDescription={product.description}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={7}>
					<ProductSlideShow images={product.images}/>
				</Grid>

				<Grid item xs={12} sm={5}>
					<Box display='flex' flexDirection='column'>
						<Typography variant='h1' component={'h1'}>{product.title}</Typography>
						<Typography variant='subtitle1' component={'h2'}>${product.price}</Typography>

						<Box sx={{ my: 2}}>
							<Typography variant='subtitle2'>Quantity</Typography>
							<ItemCounter />
							<ProductSizeSelector sizes={product.sizes} />
						</Box>

						<Button color='secondary' className='circular-btn'>
							Add to cart
						</Button>

						{/* <Chip label='No products available' color='error' variant='outlined' /> */}

						<Box sx={{ mt: 3}}>
							<Typography variant='subtitle2'>Description</Typography>
							<Typography variant='body2'>{product.description}</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async (ctx) => {

	const { slug = '' } = ctx.params as { slug: string };
	
	const product = await dbProducts.getProductBySlug(slug);

	if(!product) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}

	return {
		props: { product },
	};
};

export default ProductPage;