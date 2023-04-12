'use client'

import { signOut } from "next-auth/react"

export default async function Home() {

  return (
    <button onClick={() => signOut()} className="flex min-h-screen flex-col items-center justify-between p-24">
      Sign out
    </button>
  )
}
