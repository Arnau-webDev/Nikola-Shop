import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

import { AdminLayout } from '@/components/layouts';
import { SummaryTile } from '@/components/admin';
import { DashboardSummaryResponse } from '@/interfaces';

import { Grid, Typography } from '@mui/material';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';

const DashboardPage = () => {

	const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
		refreshInterval: 30 * 1000, // 30 seconds
	});

	const [refreshIn, setRefreshIn] = useState(30);

	useEffect(() => {
		const interval = setInterval(() => {
			setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30);
		}, 1000);

		return () => clearInterval(interval);
	}, []);
	

	if( !error && !data ) return <></>;

	if(error) {
		console.log(error);
		return <Typography>Error loading dashboard information</Typography>;
	}

	const {
		numberOfOrders,
		paidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory,
		notPaidOrders,
	} = data;

	return (
		<AdminLayout
			title='Dashborad'
			subtitle='General Website Data'
			icon={ <DashboardOutlined /> }
		>
			<Grid container spacing={2}>

				<SummaryTile 
					title={ numberOfOrders }
					subTitle="Total orders"
					icon={ <CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ paidOrders }
					subTitle="Paid orders"
					icon={ <AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ notPaidOrders }
					subTitle="Pending orders"
					icon={ <CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ numberOfClients }
					subTitle="Clients"
					icon={ <GroupOutlined color="primary" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ numberOfProducts }
					subTitle="Products"
					icon={ <CategoryOutlined color="warning" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ productsWithNoInventory }
					subTitle="Without stock"
					icon={ <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ lowInventory }
					subTitle="Low inventory"
					icon={ <ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ refreshIn }
					subTitle="Refreshes in:"
					icon={ <AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} /> }
				/>

			</Grid>

		</AdminLayout>
	);
};

export default DashboardPage;   