
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { IOrder } from '@/interfaces';
import { getToken } from 'next-auth/jwt';
import { db } from '@/database';
import { Product } from '@/models';

type Data = {
    message: string
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

	switch (req.method) {
	case 'POST':
		return createOrder(req, res);
	default:
		return res.status(400).json({ message: 'Bad Request' });
	}

}

async function createOrder(req: NextApiRequest, res: NextApiResponse<Data>) {

	const { orderItems, total } = req.body as IOrder;

	const sessionHasToken: any = await getToken( { req });

	console.log(sessionHasToken);

	if(!sessionHasToken) {
		return res.status(401).json({message: 'User needs to be authenticated to proceed!'});
	}

	const productIds = orderItems.map((orderItem) => orderItem._id);
	await db.connect();
	const dbProducts = await Product.find({ _id: { $in: productIds }});

	try {
		const totalPriceOfItems = orderItems.reduce((prev, current) => {
			const currentProductPrice = dbProducts.find( prod => prod._id === current._id)?.price;

			if(!currentProductPrice) throw new Error('Check cart info, this product doesn\'t exist');
			
			return ( currentProductPrice * current.quantity ) + prev;
		}, 0);

		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
		const backEndTotal = totalPriceOfItems * ( taxRate + 1);

		if( total !== backEndTotal) throw new Error('Total price of order has a missmatch or has been modified');

	} catch (error: any) {
		await db.disconnect();
		console.log(error);
		res.status(400).json({ message: error.message || 'Check server logs'});
	}

	// All is GOOD :D

	await db.disconnect();

	return res.status(201).json( req.body );
}
