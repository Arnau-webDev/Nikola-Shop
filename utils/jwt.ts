
import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string ) => {

	if(!process.env.JWT_SECRET_SEED) {
		throw new Error('No JWT seed available - Check enviroment variables');
	}

	return jwt.sign({ _id, email }, process.env.JWT_SECRET_SEED, { expiresIn: '30d' });

};


export const isValidToken = (token: string):Promise<string> => {
	if(!process.env.JWT_SECRET_SEED) {
		throw new Error('No JWT seed available - Check enviroment variables');
	}

	if(token.length <= 10) {
		return Promise.reject('JWT token not valid or not found');
	}

	return new Promise( (resolve, reject) => {
		try {
			jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
				if( err ) return reject('JWT not valid');

				const { _id } = payload as { _id: string };

				resolve(_id);
			});
		} catch (error) {
			reject('JWT not valid');
		}
	});
};