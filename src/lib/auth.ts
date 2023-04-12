import {NextAuthOptions} from 'next-auth'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { db } from './db'

export const authOptions: NextAuthOptions = {
    // every time somebody calls this authentication if they log in with their google account for example
    // in certain actino with our database will be taken automatically in our case meaning the user data
    // will be put into database automatically
    adapter: UpstashRedisAdapter(db)
}