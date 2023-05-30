import React, { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { AdminLayout } from '../../../components/layouts';
import { IProduct } from '../../../interfaces';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { dbProducts } from '../../../database';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { nikolaApi } from '@/api';
import { Product } from '@/models';


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

	const [newTagValue, setNewTagValue] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

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

	const onFilesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
		console.log('hola');
		const { target } = event;

		if(!target.files || target.files.length === 0) return;

		console.log(target.files);

		try {
			for( const file of target.files ) {
				console.log( file );
			}


		} catch (error) {
			console.log({ error });
		}
		
	};
	

	const onSubmit = async ( form: FormData) => {
		if( form.images.length < 2) return alert('At least 2 images required');

		setIsSaving(true);

		try {
			const { data } = await nikolaApi({
				url: '/admin/products',
				method: form._id ? 'PUT' : 'POST',
				data: form
			});

			console.log(data);
			if(!form._id) {
				router.replace(`/admin/products/${form.slug}`);
			} else {
				setIsSaving(false);
			}

		} catch (error) {
			console.log(error);
			setIsSaving(false);
		}
	};

	const onNewTag = () => {
		const newTag = newTagValue.trim().toLocaleLowerCase();
		setNewTagValue('');
		const currentTags = getValues('tags');

		if ( currentTags.includes(newTag) ) return;

		currentTags.push(newTag);
	};

	const onDeleteTag = (tag: string) => {
		const updatedTags = getValues('tags').filter( t => t !== tag );
		setValue('tags', updatedTags, { shouldValidate: true });
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
						disabled={isSaving}
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
							label="Tags"
							variant="filled"
							fullWidth 
							sx={{ mb: 1 }}
							helperText="Press [spacebar] to add"
							value={ newTagValue}
							onChange={(e) => setNewTagValue(e.target.value)}
							onKeyUp={(e) => e.code === 'Space' ? onNewTag() : undefined}
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
								getValues('tags').map((tag) => {

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
								onClick={() => fileInputRef.current?.click()}
							>
                                Load image
							</Button>
							<input 
								ref={fileInputRef}
								type='file'
								multiple
								accept='image/png, image/gif, image/jpeg'
								onChange={onFilesSelected}
								style={{ display: 'none'}}
							/>

							<Chip 
								label="At least 2 images needed"
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
                                                        Delete
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


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
	const { slug = ''} = query;

	let product: IProduct | null;

	if( slug === 'new') {
		const tempProduct = JSON.parse(JSON.stringify(new Product()));
		delete tempProduct._id;
		tempProduct.images = ['img1.jpg', 'img2.jpg'];

		product = tempProduct;
	} else {
		product = await dbProducts.getProductBySlug(slug.toString());
	}
    
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
