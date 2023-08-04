import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layouts';

import { AuthContext } from '@/context';
import { validations } from '@/utils';

import { Box, Button, Grid, Link, TextField, Typography, Chip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
	name: string,
	email: string,
	password: string,
};

const RegisterPage = () => {

	const router = useRouter();
	const { registerUser } = useContext(AuthContext);
	const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const onRegisterForm = async ( data: FormData ) => {
		const { name, email, password } = data;
		setShowError(false);

		const { hasError, message} = await registerUser(name, email, password);

		if(hasError) {
			setShowError(true);
			setTimeout(() => setShowError(false), 3000);
			setErrorMessage(message || '');
			return;
		}

		// const destination = router.query.p?.toString() || '/';
		// router.replace(destination);
		await signIn('credentials', { email, password });

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
							<NextLink href={router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'} passHref legacyBehavior>
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

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
	const session = await getSession({ req });

	const { p = '/' } = query;

	if ( session ) {
		return {
			redirect: {
				destination: p.toString(),
				permanent: false
			}
		};
	}

	return {
		props: { }
	};
};

export default RegisterPage;