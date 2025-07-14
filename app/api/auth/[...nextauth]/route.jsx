import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyUser } from '@/app/lib/users'

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null
                try {
                    const user = await verifyUser(credentials.email, credentials.password)
                    return user
                }
                catch(error) {
                    console.error(error)
                    return null
                }
            }

        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = token.user
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
            }
            return session
        },
        async redirect({url, baseUrl}) {
            return baseUrl
        }
    },
    pages: {
        signIn: '/auth/signin',
        signUp: '/auth/signup',
    },
    session: {
        strategy: 'jwt'
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}