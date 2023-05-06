import { useContext } from 'react';
import NextLink from 'next/link';

import { CartContext } from '@/context';
import { currency } from '@/utils';

import { Box, Grid, Link, Typography } from '@mui/material';

interface Props {
    orderValues?: {
        numberOfItems: number;
        subTotal: number;
        total: number;
        tax: number;
    }
}

export const OrderSummary: React.FC<Props> = ({ orderValues }) => {

	const { numberOfItems, subTotal, total, tax } = useContext(CartContext);

	const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, total, tax };

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
				<Typography>{summaryValues.numberOfItems} {summaryValues.numberOfItems > 1 ? 'Items' : 'Item'}</Typography>
			</Grid>

			<Grid item xs={6}>
				<Typography>SubTotal</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent={'end'}>
				<Typography>{currency.transform(summaryValues.subTotal)}</Typography>
			</Grid>

			<Grid item xs={6}>
				<Typography>Fees <small>({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</small></Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent={'end'}>
				<Typography>{currency.transform(summaryValues.tax)}</Typography>
			</Grid>

			<Grid item xs={6} sx={{ mt: 2 }}>
				<Typography variant='subtitle1'>Total</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent={'end'} sx={{ mt: 2 }}>
				<Typography variant='subtitle1'>{currency.transform(summaryValues.total)}</Typography>
			</Grid>
		</Grid>
	);
};
