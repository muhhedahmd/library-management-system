
"use client"

import React from 'react'
import { TabsInfo } from '../../_components/TabsInfo'
import { useGetUserProfileQuery } from '@/store/QueriesApi/ProfileQuery'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Page = () => {
    const router = useRouter()


    const {
        isLoading ,
        isFetching ,
        data : profileData

    }  = useGetUserProfileQuery({})

    if(isLoading  || isFetching){
        return <div>
            loading...
        </div>
    }


  return (
    <div className='w-full flex flex-col justify-start items-start '>
          <div className='flex items-center gap-2 my-2'>
            <Button
            variant={ "outline"}
            size={"icon"}
            onClick={() => {
                router.push(`/profile/${profileData?.userId}`)
            }}
            >
                <ChevronLeft className='h-4 w-4' />
            </Button>
                            <p
                            className='text-2xl font-bold'
                            >
                                Edit  Profile
                            </p>
                        </div>
        <TabsInfo 
        blurProfile={profileData?.profilePictures[0] && profileData?.profilePictures[0] || null}
        profileData={profileData || null}
        />
    </div>
  )
}

export default Page