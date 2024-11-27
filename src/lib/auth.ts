import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { compare } from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      phone?: string
      address?: string
    }
  }
  interface User {
    id: string
    email: string
    name: string
    role: string
    phone?: string
    address?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    name: string
    role: string
    phone?: string
    address?: string
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        try {
          const { db } = await connectToDatabase()
          const user = await db.collection('users').findOne({
            email: credentials.email.toLowerCase(),
          })

          if (!user || !user.password) {
            throw new Error('Invalid email or password')
          }

          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error('Invalid email or password')
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'user',
            phone: user.phone,
            address: user.address,
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw new Error('An error occurred during authentication')
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.phone = user.phone
        token.address = user.address
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.phone = token.phone as string | undefined
        session.user.address = token.address as string | undefined
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
