"use client"
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import UserSessionManager from './UserSessionManager'
const UserSessionProvider = ({

}) => {
  return (
    <SessionProvider>
        <UserSessionManager/>
    </SessionProvider>
  )
}

export default UserSessionProvider