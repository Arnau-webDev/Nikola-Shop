import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

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
		return createProduct(req, res);
	default:
		return res.status(400).json({ message: 'Hola request' });
	}

}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await db.connect();
	const products = await Product.find().sort({title: 'asc'}).lean();
	await db.disconnect();

	const updatedProducts = products.map((prod) => {
		prod.images = prod.images.map((img) => {
			return img.includes('http') ? img : `${ process.env.HOST_NAME }products/${ img }`;
		});

		return prod;
	});

	res.status(200).json(updatedProducts);

};

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

	const { _id = '', images = [] } = req.body as IProduct;

	if( !isValidObjectId(_id)) return res.status(400).json({ message: 'Product ID is not valid!'});

	if(images.length < 2) return res.status(400).json({ message: 'At least 2 images needed'});

	// TODO: get images absolute path

	try {
		await db.connect();
		const product = await Product.findById(_id);

		if(!product) {
			await db.disconnect();
			return res.status(400).json({ message: 'No product exists with that ID'});
		}

		// TODO: delete photos in Cloudinary

		product.images.forEach( async(image) => {
			if( !images.includes(image) ) {
				const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1).split('.');

				await cloudinary.uploader.destroy( fileId );
			}
		});


		await product.update(req.body);
		await db.disconnect();

		return res.status(200).json(product);
	} catch (error) {
		console.log(error);
		await db.disconnect();
		return res.status(400).json({ message: 'Check updateProduct server logs'});
	}

};

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { images = [] } = req.body as IProduct;

	if( images.length < 2) return res.status(400).json({ message: 'At least 2 images needed!'});

	// TODO: get images absolute path

	try {
		await db.connect();
		const productInDb = await Product.findOne({ slug: req.body.slug });

		if(productInDb) {
			await db.disconnect();
			return res.status(400).json({ message: 'A product with that slug already exists in our records'});
		}

		const product = new Product( req.body );
		await product.save();

		await db.disconnect();

		res.status(201).json( product );
		
	} catch (error) {
		console.log(error);
		await db.disconnect();
		return res.status(400).json({ message: 'Check createProduct server logs'});
	}


};

