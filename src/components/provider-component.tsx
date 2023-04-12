'use client'

import { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

interface ProviderComponentProps {
  children: ReactNode
}

const ProviderComponent: FC<ProviderComponentProps> = ({children}) => {
  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      {children}
    </>
  )
}

export default ProviderComponent