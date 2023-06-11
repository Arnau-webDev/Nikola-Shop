import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { Product } from '@/models';
import { IProduct } from '../../../interfaces/products';

type Data = { message: string } | IProduct;

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
	
	switch (req.method) {
	case 'GET':
		return getProductBySlug(req, res);
    
	default:
		return res.status(400).json({
			message: 'Bad Request'
		});
	}
}

async function getProductBySlug(req: NextApiRequest, res: NextApiResponse<Data>) {
	await db.connect();

	const { slug } = req.query;
	const product = await Product.findOne({slug}).lean();

	await db.disconnect();

	if(!product) {
		return res.status(404).json({
			message: 'Product not found'
		});
	}

	product.images = product.images.map((img) => {
		return img.includes('http') ? img : `${ process.env.HOST_NAME }products/${ img }`;
	});


	return res.json(product);
}