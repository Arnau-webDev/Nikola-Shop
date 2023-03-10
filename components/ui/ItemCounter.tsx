import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';


export const ItemCounter: React.FC = () => {
	return (
		<Box display='flex' alignItems='center'>
			<IconButton sx={{ paddingLeft: 0}}>
				<RemoveCircleOutline />
				<Typography sx={{ width: 40, textAlign: 'center'}}> 1 </Typography>
			</IconButton>
			<IconButton sx={{ paddingLeft: 0}}>
				<AddCircleOutline />
			</IconButton>
		</Box>
	);
};
