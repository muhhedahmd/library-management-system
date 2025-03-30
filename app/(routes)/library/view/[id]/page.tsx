"use client"
import dynamic from 'next/dynamic'
const ReadPage = dynamic(()=>import("./pagex"),{
  ssr: false,
  loading: () => <div>Loading...</div>,
  // error: (err) => <div>Error: {err.message}</div>
 
})
import React, { useEffect, useState } from 'react'
const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  
    const [BookId, setBookId] = useState<string>("")
    useEffect(() => {
      (async () => {
        setBookId(
          (await params).id
        )
      })()
    }, [params])
  
  return (
    <ReadPage
    BookId={BookId}
    
    />
    // <div>page</div>
  )
}

export default Page