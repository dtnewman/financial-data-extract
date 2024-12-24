import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { UsersApiV1Service } from '@/lib/generated/services/UsersApiV1Service';
import { OpenAPI } from '@/lib/generated';

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialProvider({
      credentials: {
        email: {
          type: 'email',
          label: 'Email',
          placeholder: 'Enter your email'
        },
        password: {
          type: 'password',
          label: 'Password',
          placeholder: 'Enter your password'
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error(
            'NEXT_PUBLIC_API_URL environment variable is not set'
          );
        }
        OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL;

        try {
          const response = await UsersApiV1Service.loginApiV1UsersLoginPost({
            email: credentials.email as string,
            password: credentials.password as string
          });

          if (!response) {
            throw new Error('Invalid credentials');
          }

          console.log('setting OpenAPI.TOKEN to', response.access_token);
          OpenAPI.TOKEN = response.access_token;

          return {
            id: response.id,
            email: response.email,
            name: response.name,
            accessToken: response.access_token
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error('Invalid credentials');
        }
      }
    })
  ],
  pages: {
    signIn: '/signin',
    newUser: '/signup'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = Math.floor(Date.now() / 1000 + 3600);
      }

      if (
        typeof token.expiresAt === 'number' &&
        Date.now() < token.expiresAt * 1000
      ) {
        return token;
      }

      try {
        const response =
          await UsersApiV1Service.refreshTokenApiV1UsersRefreshTokenPost(
            token.refreshToken as string
          );

        return {
          ...token,
          accessToken: response.access_token,
          refreshToken: response.refresh_token ?? token.refreshToken,
          expiresAt: Math.floor(Date.now() / 1000 + 3600)
        };
      } catch (error) {
        return token;
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
