import { useContext } from 'react';
import NextLink from 'next/link';

import { CartContext } from '@/context';
import { currency } from '@/utils';

import { Box, Grid, Link, Typography } from '@mui/material';

export const OrderSummary = () => {

	const { numberOfItems, subTotal, total, tax } = useContext(CartContext);

	return (
		<Grid container>
			<Grid item xs={6} display='flex' alignItems='center'>
				<Typography>Products</Typography>
				<Box sx={{ mx: 1}}>
					<NextLink href='/cart' passHref legacyBehavior>
						<Link underline='always' color='secondary'>( Edit )</Link>
					</NextLink>
				</Box>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent={'end'}>
				<Typography>{numberOfItems} {numberOfItems > 1 ? 'Items' : 'Item'}</Typography>
			</Grid>

			<Grid item xs={6}>
				<Typography>SubTotal</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent={'end'}>
				<Typography>{currency.transform(subTotal)}</Typography>
			</Grid>

			<Grid item xs={6}>
				<Typography>Fees <small>({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</small></Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent={'end'}>
				<Typography>{currency.transform(tax)}</Typography>
			</Grid>

			<Grid item xs={6} sx={{ mt: 2 }}>
				<Typography variant='subtitle1'>Total</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent={'end'} sx={{ mt: 2 }}>
				<Typography variant='subtitle1'>{currency.transform(total)}</Typography>
			</Grid>
		</Grid>
	);
};
