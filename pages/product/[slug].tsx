import { useState, useContext } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';


import { ProductSizeSelector, ProductSlideShow } from '@/components/products';
import { ItemCounter } from '@/components/ui/ItemCounter';
import { ShopLayout } from '@/components/layouts';

import { CartContext } from '../../context/cart/CartContext';

import { ICartProduct, IProduct, IvalidSizes } from '@/interfaces';

import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { dbProducts } from '@/database';


interface Props {
	product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {

	const router = useRouter();
	const { addProductToCart } = useContext(CartContext);

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

	const onAddProduct = () => {
		if(!tempCartProduct.size) return;

		addProductToCart(tempCartProduct);
		router.push('/cart');
	};

	const onUpdateQuantity = (quantity: number ) => {
		setTempCartProduct( currentProduct => ({
			...currentProduct,
			quantity
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
							<ItemCounter 
								currentValue={tempCartProduct.quantity}
								updateQuantity={onUpdateQuantity}
								maxValue={product.inStock}
							/>
							<ProductSizeSelector 
								sizes={product.sizes} 
								selectedSize={tempCartProduct.size}
								onSelectedSize={selectedSize}
							/>
						</Box>

						{
							(product.inStock > 0) 
								? (
									<Button color='secondary' className='circular-btn' onClick={onAddProduct}>
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

export const getStaticPaths: GetStaticPaths = async () => {
	const productSlugs = await dbProducts.getAllProductSlugs();
	
	return {
		paths: productSlugs.map( ({ slug }) => ({
			params: {
				slug
			}
		})),
		fallback: 'blocking'
	};
};

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