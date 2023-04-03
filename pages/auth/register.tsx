import { useState } from 'react';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layouts';

import { nikolaApi } from '@/api';
import { validations } from '@/utils';


import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
	name: string,
	email: string,
	password: string,
};

const RegisterPage = () => {

	const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
	const [showError, setShowError] = useState(false);

	const onRegisterForm = async ( data: FormData ) => {
		const { name, email, password } = data;
		setShowError(false);

		console.log(data);

		try {
			const { data } = await nikolaApi.post('/user/register', { email, password, name });
			const { token, user } = data;

			console.log(token, user);
		} catch (error) {
			console.log('Credentials error');
			setShowError(true);

			setTimeout(() => setShowError(false), 3000);
		}
	};
	return (
		<AuthLayout title={'Register'}>
			<form onSubmit={handleSubmit(onRegisterForm)} noValidate>

				<Box sx={{ width: 350, padding:'10px 20px' }}>
					<Chip 
						label='User already exists'
						color='error'
						icon={ <ErrorOutline /> }
						className='fadeIn'
						sx={{ display: showError ? 'flex' : 'none', my: 4, mx: 4}}
					/>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h1' component="h1">Crear cuenta</Typography>
						</Grid>

						<Grid item xs={12}>
							<TextField 
								label="Full Name" 
								variant="filled" 
								fullWidth 
								{ ...register('name', {
									required: 'This field is required',
									minLength: { value: 2, message: 'At least 2 characters needed'}
								}) }
								error={ !!errors.name}
								helperText={errors.name?.message}	
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField 
								label="Email" 
								type='email'
								variant="filled" 
								fullWidth 
								{ ...register('email', {
									required: 'This field is required',
									validate: validations.isEmail
								}) }
								error={ !!errors.email}
								helperText={errors.email?.message}																
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField 
								label="Password" 
								type='password' 
								variant="filled" 
								fullWidth 
								{ ...register('password', {
									required: 'This field is required',
								}) }
								error={ !!errors.password}
								helperText={errors.password?.message}																

							/>
						</Grid>

						<Grid item xs={12}>
							<Button color="secondary" className='circular-btn' size='large' fullWidth type='submit'>
                        Register
							</Button>
						</Grid>

						<Grid item xs={12} display='flex' justifyContent='center'>
							<NextLink href="/auth/login" passHref legacyBehavior>
								<Link underline='always' color='secondary'>
                            ¿Already have an account?
								</Link>
							</NextLink>
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

export default RegisterPage;