import {NextAuthOptions} from 'next-auth'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { db } from './db'
import { fetchRedis } from '@/helpers/redis'

function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID 
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if(!clientId || clientId.length === 0) {
        throw new Error('Missing Google Client Id')
    }
    if(!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing Google Client Secret')
    }
    return  {
        clientId, clientSecret
    }
}

export const authOptions: NextAuthOptions = {
    // every time somebody calls this authentication if they log in with their google account for example
    // in certain action with our database will be taken automatically in our case meaning the user data
    // will be put into database automatically
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    // what we want to login with
    providers: [
        GoogleProvider({
            clientId:  getGoogleCredentials()?.clientId,
            clientSecret: getGoogleCredentials()?.clientSecret
        }),
    ],
    // callbacks are actions that are taken when certain events happpen that next authh detects
    callbacks: {
        async jwt({token , user}) {
            // const dbUser = (await db.get(`user:${token.id}`)) as User | null
            const dbUserResult = await fetchRedis('get', `user:${token.id}`) as string | null
            if(!dbUserResult){
                token.id = user!.id
                return token
            }
            const dbUser = JSON.parse(dbUserResult) as User
            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image
            }
        },
        async session({session, token}) {
            if(token){
                session.user.id = token.id
                session.user.email = token.email
                session.user.name = token.name
                session.user.image = token.picture
            }
            return session
        },
        redirect() {
            return '/dashboard'
        }
    }
}