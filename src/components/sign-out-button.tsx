'use client'

import { ButtonHTMLAttributes, FC, useState } from 'react'
import Button from './ui/button-component'
import { signOut } from 'next-auth/react'
import {toast} from 'react-hot-toast'
import { Loader2, LogOut } from 'lucide-react'
// means SignOutButtonProps has everything from this ButtonHTMLAttributes<HTMLButtonElement> also has 
interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  
}

const SignOutButton: FC<SignOutButtonProps> = ({...props}) => {
    const [isSignOut, setIsSignOut] = useState<boolean>(false)
  return (
    <Button {...props} variant='ghost' onClick={async () => {
        setIsSignOut(true)
        try {
            await signOut()
        } catch (error) {
            toast.error('There was a problem signing out')
        } finally {
            setIsSignOut(false)
        }
      }}
    >
    {isSignOut ? (
        <Loader2 className='animate-spin h-4 w-4' />
    ) : <LogOut className='w-4 h-4' />
    }
    </Button>
  )
}

export default SignOutButton