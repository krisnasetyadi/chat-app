'use client'

import { FC, useState } from 'react'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'


interface FriendRequestProps {
    incomingFriendRequests: incomingFriendRequest[]
    sessionId: string
}

const FriendRequest: FC<FriendRequestProps> = ({
    incomingFriendRequests,
    sessionId,
}) => {
    const router = useRouter()
    const [friendRequest, setFriendRequest] = useState<incomingFriendRequest[]>(
        incomingFriendRequests
    )
    const acceptFriend = async (senderId: string) => {
        await axios.post('/api/friends/accept', {id: senderId })
        setFriendRequest((prev) => prev.filter((req) => req.senderId !== senderId))
        router.refresh()
    }
    const denyFriend = async (senderId: string) => {
        await axios.post('/api/friends/deny', {id: senderId })
        setFriendRequest((prev) => prev.filter((req) => req.senderId !== senderId))
        router.refresh()
    }
  return (
    <>{friendRequest.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
    ) : (
        friendRequest.map((req) => (
            <div key={req.senderId} className='flex gap-4 items-center'>
                <UserPlus className='text-black' />
                <p className='font-medium text-lg'>{req.senderEmail}</p>
                <button onClick={()=> acceptFriend(req.senderId)} arial-label="accept friend" className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
                    <Check className='font-semibold text-shite w-3/4 h-3/4' />
                </button>
                <button onClick={()=> denyFriend(req.senderId)} arial-label="deny friend" className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
                    <X className='font-semibold text-shite w-3/4 h-3/4' />
                </button>
            </div>
        ))
    )}</>
  )
}

export default FriendRequest