import { useContext } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import { useForm } from 'react-hook-form';

import { CartContext } from '@/context';
import { countries } from '@/utils';
import { ShopLayout } from '@/components/layouts';

import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material';

type FormData = {
    firstName: string;
    lastName : string;
    address  : string;
    address2?: string;
    zip      : string;
    city     : string;
    country  : string;
    phone    : string;
}

const getAddressFromCookies = ():FormData => {
	return {
		firstName : Cookie.get('firstName') || '',
		lastName  : Cookie.get('lastName') || '',
		address   : Cookie.get('address') || '',
		address2  : Cookie.get('address2') || '',
		zip       : Cookie.get('zip') || '',
		city      : Cookie.get('city') || '',
		country   : Cookie.get('country') || '',
		phone     : Cookie.get('phone') || '',
	};
};

const AddressPage = () => {

	const router = useRouter();
	const { updateAddress } = useContext(CartContext);

	const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
		defaultValues: getAddressFromCookies() 
	});

	const onSubmitAddress = ( data: FormData ) => {
		updateAddress( data );
		router.push('/checkout/summary');
	};

	return (
		<ShopLayout title="Checkout" pageDescription="Confirm address">
			<form onSubmit={ handleSubmit( onSubmitAddress ) }>
				<Typography variant="h1" component='h1'>Address</Typography>

				<Grid container spacing={2} display='flex' justifyContent='center' sx={{ mt: 2 }}>
					<Grid item xs={12} sm={6}>
						<TextField 
							label='Name' 
							variant='filled' 
							fullWidth 
							{ ...register('firstName', {
								required: 'This field is required'
							})}
							error={ !!errors.firstName }
							helperText={ errors.firstName?.message }
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField 
							label='LastName' 
							variant='filled' 
							fullWidth 
							{ ...register('lastName', {
								required: 'This field is required'
							})}
							error={ !!errors.lastName }
							helperText={ errors.lastName?.message }
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							// select
							variant="filled"
							label="Address"
							fullWidth
							{ ...register('address', {
								required: 'This field is required'
							})}
							error={ !!errors.address }
							helperText={ errors.address?.message }
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField label='Address 2 (optional)' variant='filled' fullWidth  { ...register('address2')}/>
					</Grid>

					<Grid item xs={12}>
						<FormControl fullWidth>
							<TextField
								select
								variant='filled'
								label='Country'
								{ ...register('country', {
									required: 'This field is required'
								})}
								error={ !!errors.country }
							>
								{countries.map((country) => (
									<MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>
								))}
							</TextField>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField 
							label='City' 
							variant='filled' 
							fullWidth
							{ ...register('city', {
								required: 'This field is required'
							})}
							error={ !!errors.city }
							helperText={ errors.city?.message }
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField 
							label='ZIP Code' 
							variant='filled' 
							fullWidth 
							{ ...register('zip', {
								required: 'This field is required'
							})}
							error={ !!errors.zip }
							helperText={ errors.zip?.message }
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField 
							label='Phone Number' 
							variant='filled' 
							fullWidth
							{ ...register('phone', {
								required: 'This field is required'
							})}
							error={ !!errors.phone }
							helperText={ errors.phone?.message } 
						/>
					</Grid>
				</Grid>

				<Box sx={{ mt: 5, width: '65%', mx: 'auto' }}>
					<Button color='secondary' className='circular-btn' size='large' fullWidth type='submit'>Review Order</Button>
				</Box>
			</form>

		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// import { GetServerSideProps } from 'next';

// export const getServerSideProps: GetServerSideProps = async (ctx) => {

// 	const { req } = ctx;

// 	const { token = '' } = req.cookies;
// 	let userId = '';
// 	let isValidToken = false;

// 	try {
// 		userId = await jwt.isValidToken(token);
// 		isValidToken = true;
// 	} catch (error) {
// 		isValidToken = false;
// 	}

// 	if(!isValidToken) {
// 		return {
// 			redirect: {
// 				destination: '/auth/login?p=/checkout/address',
// 				permanent: false
// 			}
// 		};
// 	}

// 	return {
// 		props: {
			
// 		}
// 	};
// };

export default AddressPage;