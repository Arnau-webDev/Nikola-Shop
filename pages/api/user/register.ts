
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { User } from '@/models';
import { jwt, validations } from '@/utils';

import bcrypt from 'bcryptjs';

type Data = 
| { message: string }
| { 
    token: string;
     user: {
        name: string;
        email: string;
        role: string;
     }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

	switch (req.method) {
	case 'POST':
		return registerUser(req, res);        
	default:
		res.status(400).json({
			message: 'Bad Request'
		});
	}
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

	const { email = '', password = '', name = ''} = req.body as { email: string, password: string, name: string};

	if( password.length < 6) {
		return res.status(400).json({
			message: 'The password must be at least 6 characters long'
		});
	}
    
	if( name.length < 2) {
		return res.status(400).json({
			message: 'Name must be at least 2 characters long'
		});
	}

	if( !validations.isValidEmail(email) ) {
		return res.status(400).json({
			message: 'This is not a valid email'
		});
	}

	await db.connect();
	const user = await User.findOne({ email: email.toLocaleLowerCase() });
    
	if( user ) {
		await db.disconnect();
		return res.status(400).json({
			message: 'This email is already registered'
		});
	}

	const newUser = new User({
		email: email.toLocaleLowerCase(),
		password: bcrypt.hashSync(password),
		role: 'client',
		name,
	});

	try {
		await newUser.save({ validateBeforeSave: true });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Check server logs'
		});
	}

	const { _id } = newUser;

	const token = jwt.signToken( _id, email );

	return res.status(200).json({
		token, 
		user: {
			name,
			email,
			role: 'client',
		}
	});
};
