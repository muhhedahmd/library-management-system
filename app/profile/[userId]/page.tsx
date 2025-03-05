"use client"

import { useEffect, useState } from "react"
import { ArrowLeftCircle, Calendar, Edit, Library, Mail, Phone, Settings, ShieldCheck, User, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import MemberContent from "../_components/MemberContent"
import AdminContent from "../_components/AdminContent"
import { isLoading, userResponse } from "@/store/Reducers/MainUserSlice"
import { useSelector } from "react-redux"
import { useGetUserProfileQuery } from "@/store/QueriesApi/ProfileQuery"
import FullSkeletonLoader from "../_components/FullSkeltonLoader"
import { ProgreeProfile } from "../_components/ProgressProfile"
import { TabsInfo } from "../_components/TabsInfo"
import { AnimatePresence, motion } from "motion/react"
import { useRouter } from "next/navigation"

// This is a mock data object - replace with your actual data fetching logic
// const mockCachedUser = {
//   admin: {
//     name: "Sarah Johnson",
//     email: "sarah.johnson@library.com",
//     phone: "+1 (555) 123-4567",
//     role: "Administrator",
//     joinDate: "March 15, 2020",
//     profileImage: "/placeholder.svg?height=200&width=200",
//     stats: {
//       booksManaged: 5243,
//       membersOverseeing: 1250,
//       activeLoans: 328,
//       overdue: 42,
//     },
//   },
//   member: {
//     name: "Michael Chen",
//     email: "michael.chen@example.com",
//     phone: "+1 (555) 987-6543",
//     role: "Member",
//     membershipType: "Premium",
//     membershipId: "MEM-2023-7845",
//     joinDate: "June 8, 2022",
//     profileImage: "/placeholder.svg?height=200&width=200",
//     stats: {
//       booksLoaned: 37,
//       currentlyBorrowed: 3,
//       reservations: 2,
//       overdue: 0,
//     },
//     recentBooks: [
//       { title: "The Midnight Library", author: "Matt Haig", returnDate: "Apr 15, 2024" },
//       { title: "Project Hail Mary", author: "Andy Weir", returnDate: "Apr 22, 2024" },
//       { title: "Atomic Habits", author: "James Clear", returnDate: "Apr 30, 2024" },
//     ],
//   },
// }

export default function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  // const { userId } = params;
  const [userIdParam, setuserIdParam] = useState<string>("")
  useEffect(() => {
    (async () => {
      setuserIdParam(
        (await params).userId
      )
    })()
  }, [])
  // console.log(userIdParam)

  const [
    editBg,
    setEditBg
  ] = useState(false)

  const { isLoading: isLoadingProfile, data: profileData, error: ErrorProfile } = useGetUserProfileQuery({
    userId: userIdParam
  })

  const Router = useRouter()
  const [scoreProfile, setScoreProfile] = useState(0);

  useEffect(() => {
    if (!profileData) return;

    // Calculate the total score
    const totalScore = Object.values({
      title: profileData.title,
      bio: profileData.bio,
      birthdate: profileData.birthdate,
      phoneNumber: profileData.phoneNumber,
      website: profileData.website,
      ProfilePicture: profileData.profilePictures,
    }).map((item)=>{
      if (item !== "" && item !== null && item !== undefined) {
        return 16.6666666667;
      }else {
        return 0 
      }
    }).reduce((acc :number , cur : number)=>{
      return acc +cur
    } ,0 )

    // Update the state once with the total score
    setScoreProfile(totalScore);

  }, [profileData]); // Add profileData as a dependency

  const CachedUser = useSelector(userResponse!)!
  const IsLoading = useSelector(isLoading)

  const [userRole, setUserRole] = useState<"admin" | "member">("admin")


  if (IsLoading || !CachedUser || isLoadingProfile) {
    return (
      <div className="container mx-auto py-6 px-4 mt-[-12] md:px-6 max-w-5xl">
        <FullSkeletonLoader />
      </div>
    );
  }


  // Toggle between admin and member view for demonstration


  // const userRole = CachedUser.Role === "ADMIN" ? mockCachedUser.admin : mockCachedUser.member

  if (!CachedUser) return
  // const user  = CachedUser



const blurProfile = profileData?.profilePictures  ? profileData.profilePictures[0] :  null

  // console.log(ProfileDataProfileData)



  return (
    <>

      <div className=" flex container justify-center items-center">


        <div className=" mx-auto container py-6 px-4 mt-[-12] md:px-6 max-w-5xl">

          <div className="flex container flex-col relative md:flex-row justify-between items-start gap-6">
            {/* Left column - Profile info */}
            <Card className="w-full md:w-1/3">
              <CardHeader className="flex flex-col items-center text-center pb-2">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={blurProfile?.secureUrl || ""} alt={CachedUser.name!} />
                  <AvatarFallback>
                    {CachedUser.name!
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{CachedUser.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={userRole === "admin" ? "destructive" : "secondary"}>{CachedUser.Role}</Badge>
                  {userRole === "member" && <Badge variant="outline">{CachedUser?.membershipType || "silver"}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{CachedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData?.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {JSON.stringify(CachedUser?.createdAt)}</span>
                  </div>
                  {userRole === "member" && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {/* <span>ID: {CachedUser.membershipId}</span> */}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 pt-2">
                  {CachedUser.Role === "ADMIN" ? (
                    <>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Books Managed</p>
                        {/* <p className="text-xl font-medium">{CachedUser.stats.booksManaged}</p> */}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Members</p>
                        {/* <p className="text-xl font-medium">{CachedUser.stats.membersOverseeing}</p> */}
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
                        <p className="text-xs text-muted-foreground">Books Loaned</p>
                        {/* <p className="text-xl font-medium">{CachedUser.stats.booksLoaned}</p> */}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Current Loans</p>
                        {/* <p className="text-xl font-medium">{CachedUser.stats.currentlyBorrowed}</p> */}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Reservations</p>
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
                <Button variant="outline" onClick={() => setEditBg(true)} className="w-full" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </CardFooter>
            </Card>

            {/* Right column - Role specific content */}
            <div className="w-full md:w-2/3 sticky top-0 space-y-6">


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
              {profileData?.user.id === CachedUser.id &&
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

              {
                editBg ?

            

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
                          profileData={profileData}
                            blurProfile={blurProfile || null}


                          />
                        </motion.div>
                      </AnimatePresence>


                  : null



              }




              {userRole === "admin" && !editBg &&

                <AnimatePresence
                  mode="wait"

                >
                  <motion.div
                    //  key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AdminContent />
                  </motion.div>
                </AnimatePresence>
              }
              {userRole === "member" && !editBg &&
                <AnimatePresence
                  mode="wait"

                >
                  <motion.div
                    //  key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    < MemberContent books={CachedUser.recentBooks} />
                  </motion.div>
                </AnimatePresence>
              }

              {/* This button is just for demo purposes to toggle between views */}
              <div className="flex justify-end mt-8">
                {/* <Button variant="outline" onClick={toggleUserRole} size="sm">
                  Switch to {userRole === "admin" ? "Member" : "Admin"} View
                </Button> */}
              </div>
            </div>
          </div>


        </div>

      </div>

    </>

  )
}

