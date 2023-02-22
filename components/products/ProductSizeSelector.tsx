import { IvalidSizes } from '@/interfaces';
import { Box, Button } from '@mui/material';

interface Props {
    selectedSize?: IvalidSizes;
    sizes: IvalidSizes[]
}

export const ProductSizeSelector: React.FC<Props> = ({ selectedSize = 'XS', sizes }) => {
	return (
		<Box>
			{
				sizes.map(size => (
					<Button key={size} size='small' color={selectedSize === size ? 'primary' : 'info'}>
						{ size }
					</Button>
				))
			}
		</Box>
	);
};
