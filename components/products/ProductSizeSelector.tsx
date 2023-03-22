import { IvalidSizes } from '@/interfaces';
import { Box, Button } from '@mui/material';

interface Props {
    selectedSize?: IvalidSizes;
    sizes: IvalidSizes[];
	onSelectedSize: (size: IvalidSizes) => void;
}

export const ProductSizeSelector: React.FC<Props> = ({ selectedSize, sizes, onSelectedSize }) => {
	return (
		<Box>
			{
				sizes.map(size => (
					<Button 
						key={size} 
						size='small' 
						color={selectedSize === size ? 'primary' : 'info'} 
						onClick={() => onSelectedSize(size)}
					>
						{ size }
					</Button>
				))
			}
		</Box>
	);
};
