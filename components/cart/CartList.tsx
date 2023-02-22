import NextLink from 'next/link';
import { ItemCounter } from '../ui/ItemCounter';

import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';

import { initialData } from '../../database/products';

const cartProducts = [
	initialData.products[0],
	initialData.products[1],
	initialData.products[2],
];

interface Props {
    isEditable?: boolean;
}

export const CartList: React.FC<Props> = ({ isEditable = false }) => {
	return (
		<>
			{
				cartProducts.map(product => (
					<Grid container spacing={2} sx={{ mb: 1 }} key={product.slug}>
						<Grid item xs={3}>
							<NextLink href='/product/slug' passHref legacyBehavior>
								<Link>
									<CardActionArea>
										<CardMedia 
											image={`/products/${product.images[0]}`}
											component='img'
											sx={{ borderRadius: '5px'}}
										/>
									</CardActionArea>
								</Link>
							</NextLink>
						</Grid>
						<Grid item xs={7}>
							<Box display='flex' flexDirection='column'>
								<Typography variant='subtitle1'>{product.title}</Typography>
								<Typography variant='body1'>Size: <strong>M</strong></Typography>

								{ isEditable ? ( <ItemCounter /> ) : ( <Typography>3 Items</Typography>) }
							</Box>
						</Grid>
						<Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
							<Typography variant='subtitle1'>${product.price}</Typography>
							{ isEditable && ( <Button variant='text' color='secondary'>Delete</Button> )}
						</Grid>
					</Grid>
				))
			}
		</>
	);
};
