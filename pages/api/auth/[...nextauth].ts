import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		CredentialsProvider({
			name: 'Custom Login',
			credentials: {
				email: { label: 'Email', type: 'email', placeholder: 'yourEmail@google.com'},
				password: { label: 'Password', type: 'password', placeholder: 'password'},
			},
			async authorize(credentials) {
				console.log(credentials);
				return { name: 'John', email: 'whatever@google.com', role: 'admin'} as any;
			}
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID ?? 'default_client_id',
			clientSecret: process.env.GITHUB_SECRET ?? 'default_client_secret',
		}),
		// ...add more providers here
	],

	callbacks: {

	}
};

export default NextAuth(authOptions);