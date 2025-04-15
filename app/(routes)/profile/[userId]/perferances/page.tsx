
"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import { userResponse } from '@/store/Reducers/MainUserSlice'

const Page = () => {
    const cahcedUser = useSelector(userResponse)!
    if(!cahcedUser) {
        return (
            <div>
                loading...
            </div>
        )
    }

  return (
    <div >


    </div>
  )
}

export default Page