

"use client"

import { Badge } from "@/components/ui/badge"
import { useUserPreferncesCategoryAuthorsQuery } from "@/store/QueriesApi/recommendationApi"
// import Link from "next/link"

const UserPreferences = ({userId}:{userId:string}) => {

    const { isLoading, isFetching, data } = useUserPreferncesCategoryAuthorsQuery({
        skip: 0 , 
        take :10,
        userId

    })
    if ((isLoading || isFetching) && !data) {
        return <>
            <div>
                <div className=" mb-4 animate-wave rounded-xl bg-muted/50 h-5 w-20" />
                <div className="flex flex-wrap gap-2">
                    {Array.from({
                        length: 5
                    }).map((e, i) => {
                        return <div key={i} className="animate-wave rounded-xl bg-muted/50 h-4 w-16" />
                    })}
                </div>
            </div>

            <div>
                <div className=" mt-4 mb-4 animate-wave rounded-xl bg-muted/50 h-5 w-20" />
                <div className="flex flex-wrap gap-2">
                    {Array.from({
                        length: 5
                    }).map((e, i) => {
                        return <div key={i} className="animate-wave rounded-xl bg-muted/50 h-4 w-16" />

                        // <div key={i} className="animate-wave bg-muted/50 w-10 h-4"/>
                    })}
                </div>
            </div>
        </>
    }
    if(!data?.category?.length && !data?.author?.length){
        return <p className="text-sm text-primary/40">
            No favorite category or author found.
        </p>
    }
    return (
        <>
            <div>
                <p className="text-sm  font-semibold mb-2">
                    Favorites category
                </p>
                <div className="flex flex-wrap gap-2">

                    {data?.category?.length ? data?.category?.map((item, i) => {
                        return  item?.name &&  <Badge key={i}  >
                            {item?.name}
                        </Badge>

                    }) :
                        <p className="text-sm text-primary/40">
                            No favorite category found.
                        </p>
                    }
                </div>
            </div>

            <div>
                <p className="text-sm  font-semibold mb-2 mt-2" >
                    Favorites authors
                </p>      <div className="flex flex-wrap gap-2">

      
                    {data?.author?.length ? data?.author?.map((item, i) => {
                        return item?.name && <Badge key={i}  >
                            {item?.name}
                        </Badge>

                        // <div key={i} className="animate-wave bg-muted/50 w-10 h-4"/>
                    }) : <p className="text-sm text-primary/40">
                        No favorite authors found.
                    </p>}
                </div>
            </div>
        </>
    )
}

export default UserPreferences