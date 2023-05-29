import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = 
| { message: string }
| IProduct[]
| IProduct

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

	switch (req.method) {
	case 'GET':
		return getProducts(req, res);
	case 'PUT':
		return updateProduct(req, res);
	case 'POST':
		// return postProduct();
		break;
	default:
		return res.status(400).json({ message: 'Bad request' });
	}

}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await db.connect();
	const products = await Product.find().sort({title: 'asc'}).lean();
	await db.disconnect();

	// Need to update images

	res.status(200).json(products);

};

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { _id = '', images = [] } = req.body as IProduct;

	if( isValidObjectId(_id)) return res.status(400).json({ message: 'Product ID is not valid!'});

	if(images.length <= 2) return res.status(400).json({ message: 'At least 2 images needed'});

	// TODO: get images absolute path

	try {
		await db.connect();
		const product = await Product.findById(_id);

		if(!product) {
			await db.disconnect();
			return res.status(400).json({ message: 'No product exists with that ID'});
		}

		// TODO: delete photos in Cloudinary


		await product.update(req.body);
		await db.disconnect();

		return res.status(200).json(product);
	} catch (error) {
		console.log(error);
		await db.disconnect();
		return res.status(400).json({ message: 'Check updateProducts server logs'});
	}

};

