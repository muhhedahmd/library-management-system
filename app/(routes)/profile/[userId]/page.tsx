"use client"

import { useEffect, useState } from "react"
import { ArrowLeftCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

import MemberContent from "../_components/MemberContent"
import AdminContent from "../_components/AdminContent"
import { isLoading, userResponse } from "@/store/Reducers/MainUserSlice"
import { useSelector } from "react-redux"
import { useGetUserProfileQuery } from "@/store/QueriesApi/ProfileQuery"
import FullSkeletonLoader from "../_components/FullSkeltonLoader"
import { ProgreeProfile } from "../_components/ProgressProfile"
import { TabsInfo } from "../_components/TabsInfo"
import { AnimatePresence, motion } from "motion/react"
import BooksPage from "../_components/BookActions/BookManage"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

// This is a mock data object - replace with your actual data fetching logic

const mockCachedUser = {

  ADMIN: {
    name: "Sarah Johnson",
    email: "sarah.johnson@library.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    joinDate: "March 15, 2020",
    profileImage: "/placeholder.svg?height=200&width=200",
    stats: {
      booksManaged: 5243,
      MEMBERsOverseeing: 1250,
      activeLoans: 328,
      overdue: 42,
    },
  },
  MEMBER: {
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 987-6543",
    role: "Member",
    MEMBERshipType: "Premium",
    MEMBERshipId: "MEM-2023-7845",
    joinDate: "June 8, 2022",
    profileImage: "/placeholder.svg?height=200&width=200",
    stats: {
      booksLoaned: 37,
      currentlyBorrowed: 3,
      reservations: 2,
      overdue: 0,
    },
    recentBooks: [
      { title: "The Midnight Library", author: "Matt Haig", returnDate: "Apr 15, 2024" },
      { title: "Project Hail Mary", author: "Andy Weir", returnDate: "Apr 22, 2024" },
      { title: "Atomic Habits", author: "James Clear", returnDate: "Apr 30, 2024" },
    ],
  },
}

export default function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  // const { userId } = params;
  const _searchParams = useSearchParams()

  const [openManageBooks, setOpenManageBooks] = useState(false)
  const [userIdParam, setuserIdParam] = useState<string>("")
  useEffect(() => {
    (async () => {
      setuserIdParam(
        (await params).userId
      )
    })()
  }, [params])
  // console.log(userIdParam)

  const [
    editBg,
    setEditBg
  ] = useState(false)

  const { isLoading: isLoadingProfile, data: profileData, } = useGetUserProfileQuery({
    userId: userIdParam
  })

  const Router = useRouter()
  const [scoreProfile, setScoreProfile] = useState(0);

  const [, setisInCreateBook] = useState(false)
  useEffect(() => {

    const InCreateBook = _searchParams.get('books')
    setisInCreateBook(InCreateBook ? true : false)

  }, [_searchParams])


  useEffect(() => {
    if (!profileData) return;

    // Calculate the total score
    const totalScore = Object.values({
      title: profileData.title,
      bio: profileData.bio,
      birthdate: profileData.birthdate,
      phoneNumber: profileData.phoneNumber,
      website: profileData?.website ? Object.values(profileData?.website).length : 0,
      ProfilePicture: profileData.profilePictures.length,
    }).map((item) => {
      if (item !== "" && item !== null && item !== undefined && item !== 0) {
        return 100 / 6;
      } else {
        return 0;
      }
    }).reduce((acc, cur) => {
      return acc + cur;
    }, 0);

    console.log("Total Score:", totalScore);

    // Update the state once with the total score
    setScoreProfile(Math.floor(totalScore));

  }, [profileData]); // Add profileData as a dependency

  const CachedUser = useSelector(userResponse)!
  const IsLoading = useSelector(isLoading)

  useEffect(() => {
    if (openManageBooks) {
      // push to the router 
      Router.push(`/profile/${userIdParam}?books=managebooks`)
    }
  }, [Router, openManageBooks, userIdParam])


  if (IsLoading || !CachedUser || isLoadingProfile) {
    return (
      <div className=" mx-auto w-full py-6 px-4 mt-[-12] md:px-6 ">
        <FullSkeletonLoader />
      </div>
    );
  }

  console.log(CachedUser)

  // Toggle between ADMIN and MEMBER view for demonstration


  // const CachedUser.role = CachedUser.role === "ADMIN" ? mockCachedUser.ADMIN : mockCachedUser.MEMBER

  if (!CachedUser) return <div>
    user not found
  </div>
  // const user  = CachedUser



  const blurProfile = profileData?.profilePictures ? profileData.profilePictures[0] : null

  // console.log(ProfileDataProfileData)



  return (
    <>

      <div className=" flex  w-full justify-center items-center">

        <div className=" w-full md:w-[100%]  flex justify-between items-center  px- mt-[-12]  ">

          <div className="flex w-full  flex-col  md:flex-row justify-center items-start gap-6">
            {/* Left column - Profile info */}
  

            {/* Right column - role specific content */}
            <div className={cn("w-full md:w-full sticky top-0 space-y-6",


              openManageBooks && "w-full md:w-full"

            )}>
              {
                isLoadingProfile &&
                <div className="flex justify-center   flex-col items-start p-4 w-full mt-2 bg-secondary rounded-md">

                  <div className="flex w-full flex-col">
                    <div className="animate-wave bg-muted/50 h-4 w-24 rounded-full mb-4" />
                    <div
                      className="flex justify-between items-center gap-4"
                    >

                      <div className="animate-wave bg-muted/50 h-4 w-[90%] rounded-full mb-4" />
                      <div className="animate-wave bg-muted/50 h-4 w-[20%] rounded-full mb-4" />
                    </div>


                  </div>
                </div>

              }
              {scoreProfile !== 100 && profileData?.user?.id === CachedUser?.id && !openManageBooks &&
                <div className="flex justify-center  flex-col items-start p-2 w-full mt-2 bg-secondary rounded-md">

                  <div className="flex   justify-between w-full">

                    {
                      !editBg &&

                      <>
                        <div className="flex flex-col justify-start">


                          <p className="font-semibold">
                            Complete ur profile

                          </p>
                          <p className="text-sm mb-3">
                            To achive best Performance

                          </p>
                        </div>
                        <Button onClick={() => {

                          setEditBg(prev => !prev)

                        }


                        }
                          variant={"outline"} className="cursor-pointer">
                          Complete
                        </Button>
                      </>

                    }

                  </div>
                  <div className="flex gap-3 justify-start items-center w-full">

                    <ProgreeProfile progress={Math.floor(scoreProfile)} />
                    <p className="font-semibold  text-sm ">
                      {Math.floor(scoreProfile)}%
                    </p>
                  </div>
                </div>
              }


              {editBg ?
                <AnimatePresence
                  mode="wait"

                >
                  <motion.div
                    className="mt-[-1.5rem]"
                    //  key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >

                    <div className="flex justify-start items-center gap-1">

                      <Button size={"icon"} className="hover:bg-primary cursor-pointer" onClick={() => setEditBg(false)} variant={"ghost"}>
                        <ArrowLeftCircle

                        />
                      </Button>
                      <h2 className="p-4 pl-0 text-xl">
                        Edit Profile
                      </h2>
                    </div>

                    <TabsInfo
                      profileData={profileData || null}
                      blurProfile={blurProfile || null}


                    />
                  </motion.div>
                </AnimatePresence>
                : null
              }
              {!openManageBooks && CachedUser.role === "ADMIN" && !editBg &&

                <AnimatePresence

                  mode="wait"

                >
                  <motion.div
                    //  key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AdminContent
                    userId={userIdParam}
                    setOpenManageBooks={setOpenManageBooks} />
                  </motion.div>
                </AnimatePresence>
              }
              {!openManageBooks && CachedUser.role === "MEMBER" && !editBg &&
                <AnimatePresence
                  mode="wait"

                >
                  <motion.div
                    //  key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    < MemberContent mainUser={true} userId={userIdParam} books={mockCachedUser.MEMBER.recentBooks} />
                  </motion.div>
                </AnimatePresence>
              }
              {
                openManageBooks && <BooksPage
                  userIdParam={userIdParam}

                  setOpenManageBooks={setOpenManageBooks}

                />
              }
            </div>
          </div>
        </div>
      </div>

    </>

  )
}

