
"use client"
import React, { useEffect, useState } from 'react'
import BookManage from '../../_components/BookActions/BookManage'

const Page = ({ params }: { params: Promise<{ userId: string }> }) => {
    const [userIdParam, setuserIdParam] = useState<string>("")
    useEffect(() => {
      (async () => {
        setuserIdParam(
          (await params).userId
        )
      })()
    }, [params])
  return (
   <BookManage
   userIdParam={userIdParam}
   setOpenManageBooks={()=>{}}
   />
  )
}

export default Page