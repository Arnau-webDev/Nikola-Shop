
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { User } from '@/models';
import { jwt } from '@/utils';

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
	case 'GET':
		return checkJWT(req, res);        
	default:
		res.status(400).json({
			message: 'Bad Request'
		});
	}


	res.status(200).json({ message: 'Example' });
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

	const { token = ''} = req.headers;

	let userId = '';

	try {
		userId = await jwt.isValidToken(token.toString());
	} catch (error) {
		return res.status(401).json({
			message: 'Auth token not valid'
		});
	}

	await db.connect();
	const user = await User.findById(userId).lean();
	await db.disconnect();

	if( !user ) {
		return res.status(400).json({
			message: 'No user exists with this ID'
		});
	}

	const { _id, email, role, name } = user;

	return res.status(200).json({
		token: jwt.signToken(_id, email), 
		user: {
			name,
			email,
			role,
		}
	});
};
