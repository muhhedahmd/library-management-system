"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
  const router = useRouter()
  return (
    <div>
      <Button 
      onClick={()=>router.push(`/checkout/success?orderId=${"1234"}`)}
      >

      </Button>
    </div>
  )
}

export default Page