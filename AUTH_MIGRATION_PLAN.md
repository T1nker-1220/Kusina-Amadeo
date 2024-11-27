# Authentication System Migration Plan

## Overview
This plan outlines the steps to migrate from Prisma to direct MongoDB integration and implement Google authentication for the Kusina De Amadeo system.

## 1. Dependencies Update
```bash
# Remove Prisma dependencies
npm uninstall @prisma/client prisma

# Install MongoDB and authentication dependencies
npm install mongodb mongoose next-auth@4.24.5 @auth/mongodb-adapter
```

## 2. Database Setup

### 2.1 MongoDB Connection
1. Create `/src/lib/mongodb.ts`:
```typescript
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
```

### 2.2 User Schema
1. Create `/src/models/User.ts`:
```typescript
import mongoose from 'mongoose'
import { hash } from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false, // Don't return password by default
  },
  name: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  googleId: String,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
})

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 12)
  }
  next()
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
```

## 3. Authentication Configuration

### 3.1 NextAuth Setup
1. Update `/src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { compare } from 'bcryptjs'
import clientPromise from '@/lib/mongodb'
import User from '@/models/User'

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        const user = await User.findOne({ email: credentials.email.toLowerCase() })
          .select('+password')

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
          role: user.role,
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
```

### 3.2 Environment Variables
Update `.env`:
```plaintext
MONGODB_URI=your_mongodb_atlas_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## 4. Frontend Components

### 4.1 Login Page
Update `/src/app/auth/login/page.tsx`:
```typescript
'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true)
      setError('')

      const result = await signIn('credentials', {
        redirect: false,
        email: data.email.toLowerCase(),
        password: data.password,
      })

      if (result?.error) {
        setError(result.error)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // ... (UI implementation)
  )
}
```

### 4.2 Auth Provider
Update `/src/providers/auth-provider.tsx`:
```typescript
'use client'

import { SessionProvider } from 'next-auth/react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

## 5. Protected Routes and Middleware

### 5.1 Update Middleware
Update `/src/middleware.ts`:
```typescript
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
    
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url))
      }
      return null
    }

    if (isAdminPage && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/auth/:path*'],
}
```

## 6. Migration Steps

1. **Backup Current Data**
   - Export current user data from Prisma/MongoDB

2. **Google OAuth Setup**
   - Create project in Google Cloud Console
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

3. **Implementation Order**
   a. Install new dependencies
   b. Set up MongoDB connection
   c. Create User model
   d. Configure NextAuth
   e. Update environment variables
   f. Implement login page
   g. Set up auth provider
   h. Update middleware
   i. Test authentication flow

4. **Testing Checklist**
   - [ ] Google sign-in flow
   - [ ] Session persistence
   - [ ] Protected routes
   - [ ] Admin access control
   - [ ] User data synchronization

## 7. Additional Considerations

### 7.1 Data Migration
```javascript
// Script to migrate user data from Prisma to MongoDB
// Save as scripts/migrate-users.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function migrateUsers() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('your_database_name');
  
  // Get existing users from your current database
  const users = await // ... get users from current database
  
  // Insert into new collection
  await db.collection('users').insertMany(users.map(user => ({
    email: user.email,
    name: user.name,
    role: user.role,
    // ... other fields
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  })));
  
  await client.close();
}
```

### 7.2 Error Handling
Create `/src/app/auth/error/page.tsx` for authentication errors:
```typescript
'use client'

import { useSearchParams } from 'next/navigation'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="mt-2 text-gray-600">{error || 'An error occurred during authentication'}</p>
      </div>
    </div>
  )
}
```

## 8. Post-Migration Tasks

1. Remove Prisma
   - Delete `prisma` directory
   - Remove Prisma-related environment variables
   - Update any remaining Prisma references

2. Update Documentation
   - Update API documentation
   - Update deployment instructions
   - Update environment variable templates

3. Monitor and Optimize
   - Set up MongoDB Atlas monitoring
   - Configure proper indexes
   - Implement caching if needed

## 9. Authentication System Fix Plan

## Current Issues
1. Login system is not properly handling admin credentials
2. Missing proper error handling and validation
3. No clear separation between admin and regular user authentication
4. Potential session management issues
5. Missing proper MongoDB integration without Prisma

## Step-by-Step Fix Plan

### 1. MongoDB Connection Setup
```typescript
// src/lib/mongodb.ts
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
```

### 2. User Model Definition
```typescript
// src/models/User.ts
import mongoose from 'mongoose'
import { hash } from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false, // Don't return password by default
  },
  name: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  googleId: String,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
})

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 12)
  }
  next()
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
```

### 3. Authentication API Updates

#### 3.1 NextAuth Configuration
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { compare } from 'bcryptjs'
import clientPromise from '@/lib/mongodb'
import User from '@/models/User'

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        const user = await User.findOne({ email: credentials.email.toLowerCase() })
          .select('+password')

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
          role: user.role,
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 4. Login Page Implementation
```typescript
// src/app/auth/login/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true)
      setError('')

      const result = await signIn('credentials', {
        redirect: false,
        email: data.email.toLowerCase(),
        password: data.password,
      })

      if (result?.error) {
        setError(result.error)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // ... (UI implementation)
  )
}
```

### 5. Environment Variables Setup
```env
# .env.local
MONGODB_URI=your_mongodb_atlas_uri
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 6. Implementation Steps

1. **Database Setup**
   - Set up MongoDB Atlas cluster
   - Create database and collections
   - Set up proper indexes
   ```javascript
   db.users.createIndex({ email: 1 }, { unique: true })
   ```

2. **Create Admin User**
   ```javascript
   // scripts/create-admin.js
   const { hash } = require('bcryptjs')
   const { MongoClient } = require('mongodb')

   async function createAdmin() {
     const client = await MongoClient.connect(process.env.MONGODB_URI)
     const db = client.db()

     const hashedPassword = await hash('your_admin_password', 12)
     
     await db.collection('users').insertOne({
       email: 'admin@example.com',
       password: hashedPassword,
       name: 'Admin',
       role: 'admin',
       createdAt: new Date(),
       updatedAt: new Date(),
     })

     await client.close()
   }
   ```

3. **Testing Steps**
   - [ ] Test MongoDB connection
   - [ ] Test admin user creation
   - [ ] Test admin login
   - [ ] Test Google login
   - [ ] Test session persistence
   - [ ] Test protected routes
   - [ ] Test error handling

4. **Security Measures**
   - Implement rate limiting
   - Add CSRF protection
   - Set secure cookie options
   - Implement proper password hashing
   - Set up proper CORS configuration

### 7. Troubleshooting Common Issues

1. **MongoDB Connection Issues**
   - Check connection string format
   - Verify network access in MongoDB Atlas
   - Check IP whitelist

2. **Authentication Failures**
   - Verify credentials in database
   - Check password hashing
   - Verify JWT secret is set
   - Check session configuration

3. **Google Authentication Issues**
   - Verify OAuth credentials
   - Check authorized redirect URIs
   - Verify consent screen configuration

4. **Session Issues**
   - Check session maxAge
   - Verify cookie settings
   - Check JWT configuration

### 8. Post-Implementation Tasks

1. **Monitoring**
   - Set up error logging
   - Monitor authentication attempts
   - Track failed logins

2. **Maintenance**
   - Regular security updates
   - Session cleanup
   - Log rotation

3. **Documentation**
   - Update API documentation
   - Document authentication flow
   - Update deployment guides
