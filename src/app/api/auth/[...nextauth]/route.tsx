import { PrismaClient } from '@prisma/client'; // Import PrismaClient
import { compare } from 'bcryptjs'; // Compare hashed password
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Declare module augmentations for session (adding `id`, `name`, and `email`)
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Define NextAuth options
const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Check if user exists and password matches
        if (user && (await compare(credentials.password, user.password))) {
          return { id: user.id.toString(), email: user.email, name: user.name };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Redirect to your custom sign-in page
  },
  session: {
    strategy: 'jwt', // Use JWT for session management
  },
  callbacks: {
    // JWT callback with custom types
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    // Session callback with custom types
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};

// API route handlers using app directory
const handler = NextAuth(authOptions);

// Export GET and POST methods
export { handler as GET, handler as POST };

