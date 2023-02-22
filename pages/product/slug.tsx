import { ShopLayout } from '@/components/layouts';
import { ProductSizeSelector, ProductSlideShow } from '@/components/products';
import { ItemCounter } from '@/components/ui/ItemCounter';

import { Box, Button, Chip, Grid, Typography } from '@mui/material';

import { initialData } from '../../database/products';

const product = initialData.products[0];

const slug = () => {
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

export default slug;