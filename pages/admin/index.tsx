import React from 'react';
import { AdminLayout } from '@/components/layouts';

import { Grid } from '@mui/material';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';
import { SummaryTile } from '@/components/admin';

const DashboardPage = () => {
	return (
		<AdminLayout
			title='Dashborad'
			subtitle='General Website Data'
			icon={ <DashboardOutlined /> }
		>
			<Grid container spacing={2}>

				<SummaryTile 
					title={ '1' }
					subTitle="Total orders"
					icon={ <CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ '2' }
					subTitle="Paid orders"
					icon={ <AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ '3' }
					subTitle="Pending orders"
					icon={ <CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ '4' }
					subTitle="Clients"
					icon={ <GroupOutlined color="primary" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ '5' }
					subTitle="Products"
					icon={ <CategoryOutlined color="warning" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ '6' }
					subTitle="Without stock"
					icon={ <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ '7' }
					subTitle="Low inventory"
					icon={ <ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} /> }
				/>

				<SummaryTile 
					title={ '8' }
					subTitle="Refreshes in:"
					icon={ <AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} /> }
				/>

			</Grid>

		</AdminLayout>
	);
};

export default DashboardPage;   