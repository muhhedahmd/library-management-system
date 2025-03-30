import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroller'

const FilterSelect = ({
    loadMore,
    hasMore,
    categories,
    placeholder = "Select an option",
    onValueChange,
}: {
    loadMore: () => void,
    hasMore: boolean,
    categories: {
        id: string,
        name: string
    }[],
    placeholder: string,
    onValueChange: (value: string) => void
}) => {
    return (
        <Select

            onValueChange={onValueChange}
       
        >
            <SelectTrigger className="min-w-full">
                <SelectValue placeholder={placeholder} /> {/* Use placeholder prop */}
            </SelectTrigger>
            <SelectContent>
                <InfiniteScroll

                    pageStart={0}
                    loadMore={loadMore}
                    hasMore={hasMore}
                    loader={
                    <>
                    </>
                        // <div className="p-2 text-center w-full flex justify-center items-center" key="loader">
                        //     <Loader2 className="animate-spin w-4 h-4" />
                        // </div>
                    }
                    // useWindow={false}
                >
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                            {category.name}
                        </SelectItem>
                    ))}
                </InfiniteScroll>
            </SelectContent>
        </Select>
    )
}

export default FilterSelect