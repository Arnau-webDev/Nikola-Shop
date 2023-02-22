import { ShopLayout } from '@/components/layouts';
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';

const AddressPage = () => {
	return (
		<ShopLayout title="Checkout" pageDescription="Confirm address">
			<Typography variant="h1" component='h1'>Address</Typography>

			<Grid container spacing={2} display='flex' justifyContent='center' sx={{ mt: 2 }}>
				<Grid item xs={12} sm={6}>
					<TextField label='Name' variant='filled' fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label='LastName' variant='filled' fullWidth />
				</Grid>

				<Grid item xs={12} sm={6}>
					<TextField label='Address' variant='filled' fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label='Address 2 (optional)' variant='filled' fullWidth />
				</Grid>

				<Grid item xs={12}>
					<FormControl fullWidth>
						<Select
							variant='filled'
							label='Country'
							value={1}
						>
							<MenuItem value={1}>Spain</MenuItem>
							<MenuItem value={2}>USA</MenuItem>
							<MenuItem value={3}>Costa Rica</MenuItem>
							<MenuItem value={4}>Honduras</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label='City' variant='filled' fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label='ZIP Code' variant='filled' fullWidth />
				</Grid>

				<Grid item xs={12} sm={6}>
					<TextField label='Phone Number' variant='filled' fullWidth />
				</Grid>
			</Grid>

			<Box sx={{ mt: 5, width: '65%', mx: 'auto' }}>
				<Button color='secondary' className='circular-btn' size='large' fullWidth>Review Order</Button>
			</Box>

		</ShopLayout>
	);
};

export default AddressPage;