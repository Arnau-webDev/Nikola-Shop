import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbUsers } from '@/database';

declare module 'next-auth' {
    interface Session {
      accessToken?: string;
    }
  }

const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	providers: [
		CredentialsProvider({
			name: 'Custom Login',
			credentials: {
				email: { label: 'Email', type: 'email', placeholder: 'yourEmail@google.com'},
				password: { label: 'Password', type: 'password', placeholder: 'password'},
			},
			async authorize(credentials) {
				// console.log(credentials);
				// return { name: 'John', email: 'whatever@google.com', role: 'admin'} as any;
				return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password) as any;
			}
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID ?? 'default_client_id',
			clientSecret: process.env.GITHUB_SECRET ?? 'default_client_secret',
		}),
		// ...add more providers here
	],
	pages: {
		signIn: '/auth/login',
		newUser: '/auth/register ',
	},
	jwt: {
		secret: process.env.JWT_SECRET_SEED,
	},
	session: {
		maxAge: 2592000, // 30 days
		strategy: 'jwt',
		updateAge: 86400, // update daily
	},
	callbacks: {
		async jwt({ token, account, user}) {
			// console.log({ token, account, user});
			if( account ) {
				token.accessToken = account.access_token;

				switch (account.type) {
				case 'oauth':
					token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '');
					break;
				case 'credentials':
					token.user = user;
					break;		
				default:
					break;
				}
			}

			return token;
		},

		async session({ session, token, user }) {
			// console.log({ token, session, user});

			session.accessToken = token.accessToken as any;
			session.user = token.user as any;

			return session;
		}
	}
};

export default NextAuth(authOptions);


