import { useMemo, useState } from 'react';
import NextLink from 'next/link';

import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from '@mui/material';

import { IProduct } from '../../interfaces/products';

interface Props {
    product: IProduct
}

export const ProductCard: React.FC<Props> = ({ product }) => {

	const [isHovered, setIsHovered] = useState(false);
	const [isImgLoaded, setIsImgLoaded] = useState(false);

	const productImg = useMemo(() => {
		return isHovered ? product.images[1] : product.images[0];
	}, [isHovered, product.images]);

	return (
		<Grid 
			item 
			xs={6} 
			sm={4} 
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Card>
				<NextLink href={`/product/${product.slug}`} passHref prefetch={false} legacyBehavior>
					<Link>
						<CardActionArea>
							{
								(product.inStock === 0) && (
									<Chip
										color='primary'
										label='Out of Stock'
										sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px'}}
									/>
								)
							}
							<CardMedia 
								component='img'
								className='fadeIn'
								image={productImg} 
								alt={product.title}
								onLoad={ () => setIsImgLoaded(true)}
							/>
						</CardActionArea>
					</Link>
				</NextLink>
			</Card>

			<Box sx={{ mt: 1, display: isImgLoaded ? 'block' : 'none'}} className='fadeIn'>
				<Typography fontWeight={700}>{product.title}</Typography>
				<Typography fontWeight={500}>${product.price}</Typography>
			</Box>
		</Grid>
	);
};
