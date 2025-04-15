"use client"

import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebuamce'
import { BooksRes } from '@/Types'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import BlurredImage from './imageWithBlurHash'


const HeaderSearch = () => {
    const [query, setQuery] = useState<string>("")
    const [data, setData] = useState<BooksRes[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const debouncedQuery = useDebounce(query, 500)

    const fetchData = async (searchQuery: string) => {
        setIsLoading(true)
        if (!searchQuery) return setData([])

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}api/books/search?q=${searchQuery}`)
            const result = await res.json()
            setData(result)
            setIsLoading(false)
        } catch (error) {
            console.error("Search failed:", error)

        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData(debouncedQuery)
    }, [debouncedQuery])

    return (
        <div className="relative w-full max-w-sm hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search for books..."
                className="w-full pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {

            <AnimatePresence 

            mode='sync'
            >


                {!isLoading && data.length > 0 ? <motion.div

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >

                    {data.length > 0 && (

                        <div className="absolute left-0 top-full mt-2 w-full bg-muted border shadow-lg z-50 rounded-md max-h-60 overflow-y-auto">
                            {data.map((book) => {
                            const thumbnail = book.bookCovers[0]
                                return <Link 
                                href={`/books/${book.id}`}
                                key={book.id} className="p-2
                                flex  justify-start items-center gap-3
                                cursor-pointer">
                                    <BlurredImage
                                    imageUrl={thumbnail.fileUrl || ""}
                                   
                                    className='object-cover w-10 min-w-10 h-10 rounded'
                                    quality={100}
                                    width={thumbnail.width ||100}
                                    height={thumbnail.height ||100}
                                    blurhash={thumbnail.blurHash || ""}
                                    alt={
                                        book.title
                                    }

                                    />
                                    <div className='flex flex-col gap-2 items-start justify-start'>
                                        <p className="text-sm font-medium">{book.title.length > 30  ? book.title.substring(0, 40) + "..." : book.title}</p>
                                        <p className="text-xs font-medium text-muted-foreground">{book?.description?.length && book?.description?.length > 40  ? book.description?.substring(0, 45) + "..." : book.description}</p>
                                    </div>
                                </Link>
                                }
                            )}
                        </div>
                    )}

                </motion.div> :
                (isLoading  && query )&&    <motion.div



                          key={Math.random()}
      
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                      >
      
                          {(
                              <div className="absolute left-0 top-full mt-2 w-full bg-muted   shadow border shadow-lg z-50 rounded-md max-h-60 overflow-y-auto">
                                  {[1, 2, 3, 4, 5, 6].map((book, i) => (
                                      <div key={Math.random() * i + book} className="p-2 flex justify-start items-center gap-3  cursor-pointer">
      
                                          <div className='w-10 h-10 rounded  animate-wave bg-muted' />
                                          <div className='flex flex-col gap-2 items-start justify-start'>
                                              <div className='w-40 h-3  rounded animate-wave bg-muted' />
                                              <div className='w-20 h-3 rounded animate-wave bg-muted' />
      
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
      
      
                      </motion.div>
                }
   
            </AnimatePresence>
            }

        </div>
    )
}

export default HeaderSearch
