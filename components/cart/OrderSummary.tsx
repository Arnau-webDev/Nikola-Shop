import { Box, Grid, Link, Typography } from '@mui/material';
import NextLink from 'next/link';

export const OrderSummary = () => {
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
				<Typography>3 Items</Typography>
			</Grid>

			<Grid item xs={6}>
				<Typography>SubTotal</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent={'end'}>
				<Typography>$155</Typography>
			</Grid>

			<Grid item xs={6}>
				<Typography>Fees <small>(15%)</small></Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent={'end'}>
				<Typography>$30</Typography>
			</Grid>

			<Grid item xs={6} sx={{ mt: 2 }}>
				<Typography variant='subtitle1'>Total</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent={'end'} sx={{ mt: 2 }}>
				<Typography variant='subtitle1'>$185</Typography>
			</Grid>
		</Grid>
	);
};
