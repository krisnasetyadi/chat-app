'use client'

import { pusherClient } from '@/lib/pusher'
import { cn, toPusherKey } from '@/lib/utils'
import { Message } from '@/lib/validations/message'
import { format } from 'date-fns'
import Image from 'next/image'
import { FC, useEffect, useRef, useState } from 'react'

interface messagesProps {
  initialMessages: Message[]
  sessionId: string 
  chatId: string
  sessionImg: string | null | undefined
  chatPartner: User
}

const Messages: FC<messagesProps> = ({
  initialMessages,
  sessionId,
  chatId,
  chatPartner,
  sessionImg
}) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages)

    const scrollDownRef = useRef<HTMLDivElement | null>(null)

    const formatTimestamp = (timestamp: number) => {
        return format(timestamp, 'HH:mm')
    }

    useEffect(() => {
        pusherClient.subscribe(toPusherKey( `chat:${chatId}`))
        const messageHandler = (message: Message) => {
            console.log('new friend request')
            setMessages((prev) => [message, ...prev])
        }
        pusherClient.bind('incoming-message', messageHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey( `chat:${chatId}`))
            pusherClient.unbind('incoming-message', messageHandler)
        }
    },[])

  return (
  <div id="message" className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
    <div ref={scrollDownRef} />
        {messages.map((message, index) => {
            const isCurrentUSer = message.senderId === sessionId
            const hasNextMessageFromSameUser = messages[index - 1]?.senderId === messages[index].senderId
            return <div className='chat-message' key={`${message.id}-${message.timestamp}`}>
                <div className={cn('flex items-end', {
                    'justify-end': isCurrentUSer
                })}>
                    <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2', {
                        'order-1 items-end': isCurrentUSer,
                        'order-2 items-start': !isCurrentUSer
                    })}>
                        <span className={cn('px-4 py-2 rounded-lg inline-block', {
                            'bg-indigo-600 text-white': isCurrentUSer,
                            'bg-gray-200 text-gray-900': !isCurrentUSer,
                            'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUSer,
                            'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUSer
                        })}>
                            {message.text}{' '}
                            <span className='ml-2 text-xs text-gray-400'>
                                {formatTimestamp(message.timestamp)}
                            </span>
                        </span>
                    </div>
                    <div className={cn('relative w-6 h-6', {
                        'order-2': isCurrentUSer,
                        'order-1': !isCurrentUSer,
                        'invisible': hasNextMessageFromSameUser
                    })}>
                        <Image 
                         fill
                         src={isCurrentUSer ? (sessionImg as string) : chatPartner.image}
                         alt='Profile picture'
                         referrerPolicy='no-referrer'
                         className='h-4 w-4 rounded-full' />
                    </div>
                </div>
            </div>
        })}
  </div>
  )
}

export default Messages