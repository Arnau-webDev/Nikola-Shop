import NextLink from 'next/link';
import { AuthLayout } from '../../components/layouts';

import { validations } from '@/utils';

import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

type FormData = {
	email: string,
	password: string,
  };

const LoginPage = () => {

	const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

	const onLoginUser = (data: FormData) => {
	};

	return (
		<AuthLayout title={'Login'}>
			<form onSubmit={handleSubmit(onLoginUser)} noValidate>
				<Box sx={{ width: 350, padding:'10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h1' component="h1">Log In</Typography>
						</Grid>

						<Grid item xs={12}>
							<TextField 
								label="Email" 
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
									minLength: { value: 6, message: 'At least 6 characters needed'}
								}) }
								error={ !!errors.password}
								helperText={errors.password?.message}
							/>
						</Grid>

						<Grid item xs={12}>
							<Button color="secondary" className='circular-btn' size='large' fullWidth type='submit'>
                        Log In
							</Button>
						</Grid>

						<Grid item xs={12} display='flex' justifyContent='center'>
							<NextLink href="/auth/register" passHref legacyBehavior>
								<Link underline='always' color='secondary'>
									{'¿Don\'t have an account?'}
								</Link>
							</NextLink>
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

export default LoginPage;