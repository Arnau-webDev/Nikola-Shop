import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders } from 'next-auth/react';

import NextLink from 'next/link';
import { AuthLayout } from '../../components/layouts';

import { validations } from '@/utils';

import { Box, Button, Divider, Grid, Link, TextField, Typography, Chip } from '@mui/material';

import { useForm } from 'react-hook-form';

import { ErrorOutline } from '@mui/icons-material';

type FormData = {
	email: string,
	password: string,
};

const LoginPage = () => {

	const router = useRouter();
	const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
	const [showError, setShowError] = useState(false);

	const [providers, setProviders] = useState<any>({});

	useEffect(() => {
		getProviders().then( prov => {
			setProviders(prov);
		});
	}, []);
	

	const onLoginUser = async (data: FormData) => {

		const { email, password } = data;
		setShowError(false);

		await signIn('credentials', { email, password});

	};

	return (
		<AuthLayout title={'Login'}>
			<form onSubmit={handleSubmit(onLoginUser)} noValidate>
				<Box sx={{ width: 350, padding:'10px 20px' }}>
					<Chip 
						label='User or password does not exist'
						color='error'
						icon={ <ErrorOutline /> }
						className='fadeIn'
						sx={{ display: showError ? 'flex' : 'none', my: 4, mx: 4}}
					/>
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
							<NextLink href={router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'} passHref legacyBehavior>
								<Link underline='always' color='secondary'>
									{'¿Don\'t have an account?'}
								</Link>
							</NextLink>
						</Grid>

						<Grid item xs={12} display='flex' flexDirection='column' justifyContent='center'>
							<Divider sx={{ width: '100%', mb: 2}} />

							{
								Object.values( providers ).map((provider: any) => {

									if(provider.id === 'credentials') return (<div key='credentials'></div>);

									return (
										<Button
											key={provider.id}
											variant='outlined'
											fullWidth
											color='primary'
											sx={{mb: 1}}
											onClick={() => signIn( provider.id )}
										>
											{ 'Login with ' + provider.name }
										</Button>
									);
								})
							}
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

export default LoginPage;


