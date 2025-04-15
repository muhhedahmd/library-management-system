"use client"
import { Button } from '@/components/ui/button'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { ArrowDownCircleIcon, Expand, List,  SmileIcon } from 'lucide-react'
import React, { useState } from 'react'
// import { useRouter } from 'next/navigation'
const RecommendationSideBar = ({ loadMore, isLoadingMain, isLoadingCollaborative, isLoadingPreference, isLoadingReading, isLoadingTrending }: { loadMore: () => void, isLoadingMain: boolean, isLoadingCollaborative: boolean, isLoadingPreference: boolean, isLoadingReading: boolean, isLoadingTrending: boolean }) => {
    const [_expand, setExpand] = useState(false)
    const [MethodList, setMethodList] = useState(false)
    // const router = useRouter()

    return (
        <div
            className={cn('w-[18rem] sticky top-[4.2rem] shadow-md  rounded-md  border-2 bg-muted h-[90vh] transition-all duration-300 ', _expand && "w-10")}
        >
            <div className='flex justify-between items-center'>
                <div
                    style={{
                        visibility: _expand ? "hidden" : "visible"
                    }}
                    className={cn(' transition-all duration-150 overflow-hidden flex justify-center items-center gap-2 text-md font-bold pl-2',
                        _expand && "w-0  opacity-0 hidden "

                    )}>
                    <SmileIcon className='w-4 h-4 text-yellow-500' />
                    Recommendations
                </div>

                <Button
                    onClick={() => setExpand(prev => !prev)}
                    variant={"outline"} size={"icon"} className=' p-1 px-1 py-1 '>

                    <Expand className='w-4 h-4' />
                </Button>

            </div>
            <div className='my-2'>
                <div className='h-[1px] bg-border w-full' />
            </div>

            <TabsList className={cn(" gap-3  w-fit  justify-start items-start text-xl  flex-col", _expand && "w-0  opacity-0 hidden ")}>

                <div className='flex items-center  flex-col'>
                    <div className='flex items-center gap-2'>

                        <Button variant={"ghost"} size={"icon"} className='p-0 w-fit cursor-pointer' onClick={() => setMethodList(prev => !prev)}>
                            <List className='w-4 h-4 text-teal-500' />
                        </Button>
                        <TabsTrigger className='cursor-pointer' value="all">All Recommendations</TabsTrigger>
                    </div>
                    <div className={cn("flex flex-col items-start h-0 overflow-hidden  relative justify-start transition-all duration-300 ml-[2rem]", MethodList && "ml-[2rem] h-[10rem]  transition-all duration-300")}>
                        <div className={cn("w-[1px] bg-border  h-[10rem] absolute left-[-.3rem] top-0 ", MethodList && "w-[1px] bg-border  h-[10rem] absolute left-[-.3rem] top-0")} />
                        <TabsTrigger className='cursor-pointer' value="rating"> Recommend Rating</TabsTrigger>
                        <TabsTrigger className='cursor-pointer' value="favorite">Recommend Favorite</TabsTrigger>
                        <TabsTrigger className='cursor-pointer' value="category">Recommend Category</TabsTrigger>
                        <TabsTrigger className='cursor-pointer' value="author">Recommend Author</TabsTrigger>
                        <TabsTrigger className='cursor-pointer' value="hybrid">Recommend Hybrid</TabsTrigger>
                    </div>
                </div>



                <TabsTrigger value="collaborative">Collaborative</TabsTrigger>
                <TabsTrigger value="preference">Preference Based</TabsTrigger>
                <TabsTrigger value="reading">Reading Based</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>



            <div className="mt-8 absolute bottom-0 left-0 w-full text-center">
                {
                    !_expand ? (
                        <Button
                            disabled={isLoadingMain || isLoadingCollaborative || isLoadingPreference || isLoadingReading || isLoadingTrending}
                            onClick={loadMore} variant="outline">
                            Load More
                        </Button>
                    ) : <Button
                    disabled={isLoadingMain || isLoadingCollaborative || isLoadingPreference || isLoadingReading || isLoadingTrending}
                    onClick={() => loadMore()} variant="ghost" className='p-0 w-fit cursor-pointer'>
                        <ArrowDownCircleIcon className='w-4 h-4' />
                    </Button>
                }
            </div>


        </div>
    )
}

export default RecommendationSideBar