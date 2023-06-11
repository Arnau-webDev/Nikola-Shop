import { useContext } from 'react';
import NextLink from 'next/link';

import { CartContext } from '@/context';

import { ItemCounter } from '../ui/ItemCounter';

import { ICartProduct, IOrderItem } from '@/interfaces';

import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
interface Props {
    isEditable?: boolean;
	products ?: IOrderItem[]
}

export const CartList: React.FC<Props> = ({ isEditable = false, products }) => {

	const { cart: cartProducts, updateCartQuantity, removeCartProduct } = useContext(CartContext);

	const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
		product.quantity = newQuantityValue;
		updateCartQuantity(product);
	};

	const productsToShow = products ? products : cartProducts;

	return (
		<>
			{
				productsToShow.map(product => (
					<Grid container spacing={2} sx={{ mb: 1 }} key={product.slug + product.size}>
						<Grid item xs={3}>
							<NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
								<Link>
									<CardActionArea>
										<CardMedia 
											image={product.image}
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
								<Typography variant='body1'>Size: <strong>{product.size}</strong></Typography>

								{ isEditable 
									? ( 
										<ItemCounter 
											currentValue={product.quantity}
											updateQuantity={(newValue) => onNewCartQuantityValue(product as ICartProduct, newValue)}
										/> 
									) 
									: ( <Typography>{ product.quantity} {product.quantity > 1 ? 'Items' : 'Item'}</Typography>) 
								}
							</Box>
						</Grid>
						<Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
							<Typography variant='subtitle1'>${product.price}</Typography>
							{ isEditable && ( 
								<Button 
									variant='text' 
									color='secondary'
									onClick={() => removeCartProduct(product as ICartProduct)}
								>
									Remove
								</Button> )}
						</Grid>
					</Grid>
				))
			}
		</>
	);
};
