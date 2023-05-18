import { useState, useEffect } from 'react';
import { PeopleOutline } from '@mui/icons-material';
import useSWR from 'swr';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, Select, MenuItem } from '@mui/material';

import { AdminLayout } from '../../components/layouts';
import { IUser } from '../../interfaces';
import { nikolaApi } from '../../api';

const UsersPage = () => {

	const { data, error } = useSWR<IUser[]>('/api/admin/users');
	const [ users, setUsers ] = useState<IUser[]>([]);

	useEffect(() => {
		if (data) {
			setUsers(data);
		}
	}, [data]);
    
	if ( !data && !error ) return (<></>);

	const onRoleUpdated = async( userId: string, newRole: string ) => {

		const previousUsers = users.map( user => ({ ...user }));
		const updatedUsers = users.map( user => ({
			...user,
			role: userId === user._id ? newRole : user.role
		}));

		setUsers(updatedUsers);

		try {
            
			await nikolaApi.put('/admin/users', {  userId, role: newRole });

		} catch (error) {
			setUsers( previousUsers );
			console.log(error);
			alert('Could not update user role');
		}
	};


	const columns: GridColDef[] = [
		{ field: 'email', headerName: 'Email', width: 250 },
		{ field: 'name', headerName: 'Complete Name', width: 300 },
		{
			field: 'role', 
			headerName: 'Role', 
			width: 300,
			renderCell: ({row}) => {
				return (
					<Select
						value={ row.role }
						label="Rol"
						onChange={ ({ target }) => onRoleUpdated( row.id, target.value ) }
						sx={{ width: '300px' }}
					>
						<MenuItem value='admin'> Admin </MenuItem>
						<MenuItem value='client'> Client </MenuItem>
						<MenuItem value='super-user'> Super User </MenuItem>
						<MenuItem value='SEO'> SEO </MenuItem>
					</Select>
				);
			}
		},
	];

	const rows = users.map( user => ({
		id: user._id,
		email: user.email,
		name: user.name,
		role: user.role
	}));


	return (
		<AdminLayout 
			title={'Users'} 
			subtitle={'Handle users'}
			icon={ <PeopleOutline /> }
		>
			<Grid container className='fadeIn' marginTop={2}>
				<Grid item xs={12} sx={{ height:650, width: '100%' }}>
					<DataGrid 
						rows={ rows }
						columns={ columns }
						pageSize={ 10 }
						rowsPerPageOptions={ [10] }
					/>

				</Grid>
			</Grid>


		</AdminLayout>
	);
};

export default UsersPage;