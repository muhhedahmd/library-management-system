"use client"
import { useGetUserQuery } from '@/store/QueriesApi/ProfileQuery'
import React, { useEffect, useRef, useState } from 'react'
import FullSkeletonLoader from '../../profile/_components/FullSkeltonLoader'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Mail, Phone, UserIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import MemberContent from '@/app/(routes)/profile/_components/MemberContent'
import AdminContent from '@/app/(routes)/profile/_components/AdminContent'
import { cn } from '@/lib/utils'
import { useGetBooklibraryQuery } from '@/store/QueriesApi/booksApi'
import { BooksRes } from '@/Types'
import Image from 'next/image'
import Link from 'next/link'


const Page = ({ params }: { params: Promise<{ userId: string }> }
) => {

  const [userIdParam, setuserIdParam] = useState<string>("")
  useEffect(() => {
    (async () => {
      setuserIdParam(
        (await params).userId
      )
    })()
  }, [params])
  const { data: user, isLoading, isFetching } = useGetUserQuery({ userId: userIdParam })

  const { data: books, isLoading: isBooksLoading, isFetching: isBooksFetching } = useGetBooklibraryQuery({ userId: userIdParam })

  // const [booksFromReadingHistory, setBooksFromReadingHistory] = useState<BooksRes[]>([])



  const [isIntercectThelib, setIsIntercectThelib] = useState<boolean>(false)
  const LibRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleScroll = window.addEventListener("scroll", () => {
      if (LibRef.current && LibRef?.current?.offsetTop) {
        if (window.scrollY > (LibRef?.current?.offsetTop + 400)) {

          setIsIntercectThelib(true)
        } else {
          setIsIntercectThelib(false)
        }
      }


    })

    return () => {
      window.removeEventListener("scroll", () => handleScroll)
    }
  }, [])


  if (isLoading || isFetching) {
    return (

      <div className="container mx-auto py-6 px-4 mt-[-12] md:px-6 max-w-5xl">
        <FullSkeletonLoader />
      </div>
    );
  }
  return (
    <div className=" flex container justify-center items-center">

      <div className=" w-full md:w-[100%]  flex justify-between items-center py-6 px-4 mt-[-12]  ">

        <div className="flex w-full  flex-col  md:flex-row justify-center items-start gap-6">

          <Card className="w-full sm:sticky static top-[4.5rem] md:w-1/3">
            <CardHeader className="flex flex-col items-center text-center pb-2">
              <Avatar className="h-24 w-24 mb-4 bg-muted">

                <AvatarImage src={user?.profile?.profilePictures[0]?.secureUrl || ""} alt={user?.name} />
                <AvatarFallback>
                  <UserIcon className='w-10 h-10' />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user?.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={user?.role === "ADMIN" ? "destructive" : "secondary"}>{user?.role}</Badge>
                {user?.role === "MEMBER" && <Badge variant="outline">{"silver"}</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.profile?.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {JSON.stringify(user?.createdAt)}</span>
                </div>

              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 pt-2">
                {user?.role === "ADMIN" ? (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Books Managed</p>
                      {/* <p className="text-xl font-medium">{CachedUser.stats.booksManaged}</p> */}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Members</p>
                      {/* <p className="text-xl font-medium">{CachedUser.stats.MEMBERsOverseeing}</p> */}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Active Loans</p>
                      {/* <p className="text-xl font-medium">{CachedUser.stats.activeLoans}</p> */}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Overdue</p>
                      {/* <p className="text-xl font-medium text-destructive">{CachedUser.stats.overdue}</p> */}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex justify-start gap-2 items-center">Totql favorite</p>
                      {/* <p className="text-xl font-medium">{CachedUser.stats.booksLoaned}</p> */}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Current Loans</p>
                      {/* <p className="text-xl font-medium">{CachedUser.stats.currentlyBorrowed}</p> */}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Avg reading time</p>
                      {/* <p className="text-xl font-medium">{CachedUser.stats.reservations}</p> */}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Overdue</p>
                      {/* <p className="text-xl font-medium text-destructive">{CachedUser.stats.overdue}</p> */}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">

            </CardFooter>

          </Card>

          <div className={cn("w-full md:w-2/3 sticky top-0 space-y-6",

          )}>



            {user?.role === "ADMIN" &&


              <AdminContent />

            }
            {user?.role === "MEMBER" &&

              <>

                <MemberContent userId={user?.id} mainUser={false} />
                <Card ref={LibRef} className='pt-0 gap-0'>

                  {
                    isIntercectThelib &&
                    <CardHeader className=' md:hidden flex p-2 pl-[1.4rem] sticky top-[4em]  z-20 rounded-md rounded-b-none  backdrop-blur-3xl  flex-row gap-2 justify-start items-center'>
                      <Avatar className="h-12 w-12  bg-muted">

                        <AvatarImage src={user?.profile?.profilePictures[0]?.secureUrl || ""} alt={user?.name} />
                        <AvatarFallback>
                          <UserIcon className='w-5 h-5' />
                        </AvatarFallback>
                      </Avatar>
                      <p className='text-xl font-bold '>
                        {user?.name}
                      </p>

                      <Badge className=' '>
                        library
                      </Badge>
                    </CardHeader>
                  }

                  <CardContent className='mt-4'>

                    <div className='  grid md:grid-cols-2  py-4 gap-4 max-w-5xl overflow-x-auto'>

                      {
                        !books && !books?.length && ( isBooksLoading || isBooksFetching) ?

                          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 22, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 22, 11]?.map((item, i) => (
                            <LibraryCardLoader key={i} />
                          )) :

                             books?.map((item) => (
                            <LibraryCard key={item.id} item={item} />
                          ))
                      }
                      {
                        !books?.length ?

                          <div className='flex flex-col gap-2'>
                            <p className='text-sm text-muted-foreground'>No books found</p>
                          </div>
                          : null
                      }

                    </div>
                  </CardContent>
                </Card>
              </>

            }

          </div>
        </div>
      </div>
    </div>
  )
}

export default Page

const LibraryCard = ({ item }: { item: BooksRes }) => {


  return (
    <>
    <Card className=' border-none  w-full px-0 py-2'>
      {/* <CardHeader> */}
      {/* <CardTitle>Library </CardTitle> */}
      {/* </CardHeader> */}
      <CardContent className='border-none'>
        <Link
          href={`/books/${item.id}`}
          // variant={isActive ? "secondary" : "ghost"}
          className="w-full justify-start h-auto py-2 px-2"
          //   onClick={handleClick}
          >
          <div className="flex items-center w-full">
            <div className="w-20 h-20 relative flex-shrink-0 rounded overflow-hidden mr-3">
              <Image
                src={item.bookCovers?.[0]?.fileUrl || "/placeholder.svg?height=56&width=40"}
                alt={item.title}
                fill
                className="object-center"
              />
            </div>
            <div className='flex flex-col gap-2'>

              <div className="flex-1 min-w-0 text-left">

                <p className="font-medium text-sm truncate">{item.title.length > 100 ? item.title.substring(20) + "..." : item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.author.name}</p>
              </div>
              <div className='flex flex-col items-start justify-start gap-2'>

                <p className='text-xs text-muted-foreground'>
                  by: {item.author.name}
                </p>
                <p className='text-xs text-muted-foreground'>
                  more in {item.category.name}
                </p>
              </div>

            </div>
          </div>
        </Link>

      </CardContent>
    </Card>
    <Separator/>
          </>
  )
}

const LibraryCardLoader = () => {
  return (
    <Card className=' border-none shadow-none w-full px-0 py-2'>
      <CardContent className='border-none'>
        <div className="w-full justify-start h-auto py-2 px-2">
          <div className="flex items-center w-full">
            <div className="w-20 h-20 rounded-md relative flex-shrink-0  overflow-hidden mr-3 bg-muted animate-wave"></div>
            <div className='flex flex-col gap-2 flex-1'>
              <div className="flex-1 min-w-0 text-left space-y-2">
                <div className="h-4 bg-muted rounded animate-wave w-3/4"></div>
                <div className="h-3 bg-muted rounded animate-wave w-1/2"></div>
              </div>
              <div className='flex flex-col items-start justify-start gap-2'>
                <div className="h-3 bg-muted rounded animate-wave w-1/3"></div>
                <div className="h-3 bg-muted rounded animate-wave w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}