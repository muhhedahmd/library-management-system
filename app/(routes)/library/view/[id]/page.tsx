"use client"
import dynamic from 'next/dynamic'
const ReadPage = dynamic(()=>import("./pagex"),{
  ssr: false,
  loading: () => <div>Loading...</div>,
  // error: (err) => <div>Error: {err.message}</div>
 
})
import React, { useEffect, useState } from 'react'
const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  
    const [id, setId] = useState<string>("")
    useEffect(() => {
      (async () => {
        setId(
          (await params).id
        )
      })()
    }, [params])
  
  return (
    <ReadPage
    id={id}
    
    />
    // <div>page</div>
  )
}

export default Page