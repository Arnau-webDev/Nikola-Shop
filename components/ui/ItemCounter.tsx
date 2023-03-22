import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

interface Props {
	currentValue: number;
	updateQuantity: (value: number) => void;
	maxValue?: number;
}


export const ItemCounter: React.FC<Props> = ({ currentValue, updateQuantity, maxValue = 5}) => {

	const addOrRemove = ( type: string ) => {
		if(type === 'increase' && currentValue < maxValue) updateQuantity(currentValue + 1);
		if(type === 'decrease' && currentValue > 1) updateQuantity(currentValue - 1);
	};

	return (
		<Box display='flex' alignItems='center'>
			<IconButton sx={{ paddingLeft: 0}} onClick={() => addOrRemove('decrease')}>
				<RemoveCircleOutline />
				<Typography sx={{ width: 40, textAlign: 'center'}}> {currentValue} </Typography>
			</IconButton>
			<IconButton sx={{ paddingLeft: 0}} onClick={() => addOrRemove('increase')}>
				<AddCircleOutline/>
			</IconButton>
		</Box>
	);
};
