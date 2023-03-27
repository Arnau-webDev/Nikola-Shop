
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { User } from '@/models';
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
		return loginUser(req, res);        
	default:
		res.status(400).json({
			message: 'Bad Request'
		});
	}


	res.status(200).json({ message: 'Example' });
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

	const { email = '', password = ''} = req.body;

	await db.connect();
	const user = await User.findOne({ email });
	await db.disconnect();

	if( !user ) {
		return res.status(400).json({
			message: 'Email or password not valid - EMAIL'
		});
	}

	if(!bcrypt.compareSync(password, user.password!)) {
		return res.status(400).json({
			message: 'Email or password not valid - PASSWORD'
		});
	}

	const { name, role } = user;

	return res.status(200).json({
		token: '', //jwt
		user: {
			name,
			email,
			role,
		}
	});
};
