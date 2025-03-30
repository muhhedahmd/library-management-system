
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@radix-ui/react-separator'
import React from 'react'

const LibrarySidebarSkeleton = () => {
  return (
    <div
    className={`border-r bg-background flex flex-col transition-all duration-300 ${ "w-full md:w-80"    }`}
  >
    <div className="flex items-center justify-between p-4 h-14 border-b">
       <h2 className="font-semibold text-lg">My Library</h2>
      <div  className="ml-auto">
        {/* {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />} */}
      </div>
    </div>

    
      <div className="p-4">
        <div className="relative">
          {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> */}
          <div
            className=" w-full h-6 animate-wave rounded-md  pl-8"
          // onKeyUp={handleSearch}
          />
        </div>
      </div>
    

      <div  className="px-2 w-full" >
        <div className="w-full flex  gap-3 justify-between">
          <div   className="text-xs animate-wave rounded-md w-1/3 h-10 bg-muted">
            
          </div>
          <div className="text-xs w-1/3 bg-muted animate-wave rounded-md">
            
          </div>
          <div  className="text-xs w-1/3 bg-muted animate-wave rounded-md">
            
          </div>
        </div>
      </div>
    

    <Separator className="my-2" />

    <ScrollArea className="flex-1 max-h-[67vh]">

    
   
        <div  className="space-y-4  p-2">
            {
                Array.from({ length: 11 }).map((_, index) => (
                    <div key={index} className="flex gap-2">
                        <div className="animate-wave  w-20  min-w-20 h-20 bg-muted rounded-md"></div>
                        <div className="  w-full h-10  rounded-md">
                            <div className="w-full h-full flex flex-col gap-2">
                                <div className="w-full h-10 bg-muted animate-wave rounded-md"></div>
                                <div className="w-3/4 h-10 bg-muted animate-wave rounded-md"></div>
                            </div>

                        </div>
                    </div>
                ))
            }
          
        </div >
    </ScrollArea>

    <div className="border-t p-4">
      <div className={"w-full p-2 h-10 animate-wave rounded-md" } >
        
      </div>
    </div>
  </div>
  )
}

export default LibrarySidebarSkeleton