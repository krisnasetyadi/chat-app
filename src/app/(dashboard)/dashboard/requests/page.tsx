import AddFriendButton from '@/components/add-friend-button-component'
import FriendRequest from '@/components/friend-request'
import FriendRequestSidebarOption from '@/components/friend-request-sidebar-option'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

const page = async ({}) => {
  const session = await getServerSession(authOptions)
  if(!session) notFound()
  const incomingSenderIds = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_request`) as string[])

  const incomingFriendRequest = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
        const sender = await fetchRedis('get', `user:${senderId}`) as string
        const senderParsed = JSON.parse(sender) as User
        return {
            senderId,
            senderEmail: senderParsed.email
        }
    })
  )
  return (
  <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
    <div className='flex flex-col gap-4'>
        <FriendRequest incomingFriendRequests={incomingFriendRequest} sessionId={session.user.id} />
    </div>
  </main>
  )
}

export default page