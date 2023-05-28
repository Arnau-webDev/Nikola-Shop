import React, { FC, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useForm } from 'react-hook-form';

import { AdminLayout } from '../../../components/layouts';
import { IProduct } from '../../../interfaces';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { dbProducts } from '../../../database';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';


const validTypes  = ['shirts','pants','hoodies','hats'];
const validGender = ['men','women','kid','unisex'];
const validSizes = ['XS','S','M','L','XL','XXL','XXXL'];

interface FormData {
    _id?       : string;
    description: string;
    images     : string[];
    inStock    : number;
    price      : number;
    sizes      : string[];
    slug       : string;
    tags       : string[];
    title      : string;
    type       : string;
    gender     : string;
}

interface Props {
    product: IProduct;
}

const ProductAdminPage:FC<Props> = ({ product }) => {

	const {register, handleSubmit, formState:{ errors }, getValues, setValue, watch} = useForm<FormData>({
		defaultValues: product
	});

	useEffect(() => {
		const subscription = watch(( value, { name, type } ) => {
			if(name === 'title') {
				const newSlug = value.title?.trim().replaceAll(' ', '_').replaceAll('\'', '').toLocaleLowerCase() || '';

				setValue('slug', newSlug, { shouldValidate: true});
			}

			return () => subscription.unsubscribe();
		});
	}, [watch, setValue]);
	

	const onSubmit = ( form: FormData) => {
		console.log(form);
	};

	const onDeleteTag = (tag: string) => {
		// getValues('');
	};

	const onChnageSize = (size: string) => {
		const currentSizes = getValues('sizes');

		if(currentSizes.includes(size)) {
			return setValue('sizes', currentSizes.filter((s) => s !== size), {shouldValidate: true});
		}

		setValue('sizes', [...currentSizes, size], {shouldValidate: true});
	};

	return (
		<AdminLayout 
			title={'Producto'} 
			subtitle={`Editando: ${ product.title }`}
			icon={ <DriveFileRenameOutline /> }
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
					<Button 
						color="secondary"
						startIcon={ <SaveOutlined /> }
						sx={{ width: '150px' }}
						type="submit"
					>
                        Save
					</Button>
				</Box>

				<Grid container spacing={2}>
					{/* Data */}
					<Grid item xs={12} sm={ 6 }>

						<TextField
							label="Title"
							variant="filled"
							fullWidth 
							sx={{ mb: 1 }}
							{ ...register('title', {
								required: 'This field is required',
								minLength: { value: 2, message: 'Needs at least 2 caracteres' }
							})}
							error={ !!errors.title }
							helperText={ errors.title?.message }
						/>

						<TextField
							label="Description"
							variant="filled"
							fullWidth 
							multiline
							rows={5}
							sx={{ mb: 1 }}
							{ ...register('description', {
								required: 'This field is required',
								minLength: { value: 2, message: 'Needs at least 2 caracteres' }
							})}
							error={ !!errors.description }
							helperText={ errors.description?.message }
						/>

						<TextField
							label="Inventory"
							type='number'
							variant="filled"
							fullWidth 
							sx={{ mb: 1 }}
							{ ...register('inStock', {
								required: 'This field is required',
								min: { value: 0, message: 'Needs at least 0' }
							})}
							error={ !!errors.inStock }
							helperText={ errors.inStock?.message }
						/>
                        
						<TextField
							label="Price"
							type='number'
							variant="filled"
							fullWidth 
							sx={{ mb: 1 }}
							{ ...register('price', {
								required: 'This field is required',
								minLength: { value: 2, message: 'Needs at least 2 caracteres' }
							})}
							error={ !!errors.title }
							helperText={ errors.title?.message }
						/>

						<Divider sx={{ my: 1 }} />

						<FormControl sx={{ mb: 1 }}>
							<FormLabel>Type</FormLabel>
							<RadioGroup
								row
								value={getValues('type')}
								onChange={(e) => setValue('type', e.target.value, {shouldValidate: true})}
							>
								{
									validTypes.map( option => (
										<FormControlLabel 
											key={ option }
											value={ option }
											control={ <Radio color='secondary' /> }
											label={ capitalize(option) }
										/>
									))
								}
							</RadioGroup>
						</FormControl>

						<FormControl sx={{ mb: 1 }}>
							<FormLabel>Gender</FormLabel>
							<RadioGroup
								row
								value={getValues('gender')}
								onChange={(e) => setValue('gender', e.target.value, {shouldValidate: true})}
							>
								{
									validGender.map( option => (
										<FormControlLabel 
											key={ option }
											value={ option }
											control={ <Radio color='secondary' /> }
											label={ capitalize(option) }
										/>
									))
								}
							</RadioGroup>
						</FormControl>

						<FormGroup>
							<FormLabel>Sizes</FormLabel>
							{
								validSizes.map(size => (
									<FormControlLabel 
										key={size} 
										control={<Checkbox  checked={getValues('sizes').includes(size)} /> } 
										label={ size } 
										onChange={() => onChnageSize(size)}
									/>
								))
							}
						</FormGroup>

					</Grid>

					{/* Tags e imagenes */}
					<Grid item xs={12} sm={ 6 }>
						<TextField
							label="Slug - URL"
							variant="filled"
							fullWidth
							sx={{ mb: 1 }}
							{ ...register('slug', {
								required: 'This field is required',
								validate: (val) => val.trim().includes(' ') ? 'Cannot have empty spaces' : undefined
							})}
							error={ !!errors.slug }
							helperText={ errors.slug?.message }
						/>

						<TextField
							label="Etiquetas"
							variant="filled"
							fullWidth 
							sx={{ mb: 1 }}
							helperText="Press [spacebar] to add"
						/>
                        
						<Box sx={{
							display: 'flex',
							flexWrap: 'wrap',
							listStyle: 'none',
							p: 0,
							m: 0,
						}}
						component="ul">
							{
								product.tags.map((tag) => {

									return (
										<Chip
											key={tag}
											label={tag}
											onDelete={ () => onDeleteTag(tag)}
											color="primary"
											size='small'
											sx={{ ml: 1, mt: 1}}
										/>
									);
								})}
						</Box>

						<Divider sx={{ my: 2  }}/>
                        
						<Box display='flex' flexDirection="column">
							<FormLabel sx={{ mb:1}}>Imágenes</FormLabel>
							<Button
								color="secondary"
								fullWidth
								startIcon={ <UploadOutlined /> }
								sx={{ mb: 3 }}
							>
                                Cargar imagen
							</Button>

							<Chip 
								label="Es necesario al 2 imagenes"
								color='error'
								variant='outlined'
							/>

							<Grid container spacing={2}>
								{
									product.images.map( img => (
										<Grid item xs={4} sm={3} key={img}>
											<Card>
												<CardMedia 
													component='img'
													className='fadeIn'
													image={ `/products/${ img }` }
													alt={ img }
												/>
												<CardActions>
													<Button fullWidth color="error">
                                                        Borrar
													</Button>
												</CardActions>
											</Card>
										</Grid>
									))
								}
							</Grid>

						</Box>

					</Grid>

				</Grid>
			</form>
		</AdminLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
	const { slug = ''} = query;
    
	const product = await dbProducts.getProductBySlug(slug.toString());

	if ( !product ) {
		return {
			redirect: {
				destination: '/admin/products',
				permanent: false,
			}
		};
	}
    

	return {
		props: {
			product
		}
	};
};


export default ProductAdminPage;
