import { useState } from 'react';
import { GetStaticPaths, GetStaticPathsContext, GetStaticProps, NextPage } from 'next';

import { ProductSizeSelector, ProductSlideShow } from '@/components/products';
import { ItemCounter } from '@/components/ui/ItemCounter';
import { ShopLayout } from '@/components/layouts';

import { ICartProduct, IProduct, IvalidSizes } from '@/interfaces';

import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { dbProducts } from '@/database';


interface Props {
	product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {

	const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
		_id: product._id,
		image: product.images[0],
		price: product.price,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1,
	});

	const selectedSize = (size: IvalidSizes) => {
		setTempCartProduct( currentProduct => ({
			...currentProduct,
			size
		}));
	};

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
							<ProductSizeSelector 
								sizes={product.sizes} 
								selectedSize={tempCartProduct.size}
								onSelectedSize={selectedSize}
							/>
						</Box>

						{
							(product.inStock > 0) 
								? (
									<Button color='secondary' className='circular-btn'>
										{ tempCartProduct.size ? 'Add to cart' : 'Select size' }
									</Button>
								)
								: ( <Chip label='No products available' color='error' variant='outlined' /> )
						}

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

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx: GetStaticPathsContext) => {
	const productSlugs = await dbProducts.getAllProductSlugs();  

	return {
		paths: productSlugs.map( obj => ({
			params: { slug: obj.slug }
		})),
		fallback: 'blocking'
	};
};

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
// import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async (ctx) => {
	const { params } = ctx;
	const { slug = '' } = params as { slug: string };
	
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
		revalidate: 60 * 60 * 24
	};
};

export default ProductPage;