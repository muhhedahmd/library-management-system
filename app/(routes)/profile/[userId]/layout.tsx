"use client"
import { Calendar, Edit, Library, Mail, Phone, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { isLoading, userResponse } from "@/store/Reducers/MainUserSlice"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"



export default function Layout({
    children
}: {
    children: React.ReactNode
}) {

    const CachedUser = useSelector(userResponse)!

    const router = useRouter()








    const IsLoading = useSelector(isLoading)

    //   useEffect(() => {
    //     if (openManageBooks) {
    //       // push to the router 
    //       Router.push(`/profile/${userIdParam}?books=managebooks`)
    //     }
    //   }, [Router, openManageBooks, userIdParam])


    if (IsLoading || !CachedUser) {
        return (
            <div className=" mx-auto py-6  px-4 mt-[-12] md:px-6 ">
                <div className="flex flex-col w-full relative md:flex-row justify-between items-start gap-6">

                    <Card className="w-full static md:sticky top-[1rem] md:w-1/3">
                        <CardHeader className="flex flex-col items-center text-center pb-2">
                            {/* Avatar Skeleton */}
                            <div className="animate-wave bg-muted/50 h-24 w-24 rounded-full mb-4" />
                            {/* Name Skeleton */}
                            <div className="animate-wave rounded-xl bg-muted/50 h-6 w-48 mb-2" />
                            {/* Role Skeleton */}
                            <div className="animate-wave rounded-xl bg-muted/50 h-4 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Contact Info Skeleton */}
                            <div className="space-y-2">
                                <div className="animate-wave rounded-xl bg-muted/50 h-4 w-64" />
                                <div className="animate-wave rounded-xl bg-muted/50 h-4 w-64" />
                                <div className="animate-wave rounded-xl bg-muted/50 h-4 w-64" />
                            </div>
                            <Separator />
                            {/* Stats Skeleton */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                {[...Array(4)].map((_, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="animate-wave rounded-xl bg-muted/50 h-4 w-20" />
                                        <div className="animate-wave rounded-xl bg-muted/50 h-4 w-12" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            {/* Buttons Skeleton */}
                            <div className="animate-wave rounded-xl bg-muted/50 h-6 w-full" />
                            <div className="animate-wave rounded-xl bg-muted/50 h-6 w-full" />
                        </CardFooter>
                    </Card>
                </div>
                {/* <FullSkeletonLoader /> */}
            </div>
        );
    }


    // Toggle between ADMIN and MEMBER view for demonstration


    // const CachedUser.role = CachedUser.role === "ADMIN" ? mockCachedUser.ADMIN : mockCachedUser.MEMBER

    if (!CachedUser) return
    // const user  = CachedUser



    const blurProfile = CachedUser?.profile?.profilePictures ? CachedUser?.profile?.profilePictures[0] : null

    // console.log(ProfileDataProfileData)



    return (
        <>

            <div className=" flex  justify-center items-center">


                <div className=" w-full md:w-[100%]  flex justify-between items-center py-6  mt-[-12]  ">

                    <div className="flex w-full  flex-col  md:flex-row justify-center items-start gap-6">
                        {/* Left column - Profile info */}
                        {

                            <Card className="w-full  md:sticky static top-[4.5rem] md:w-1/3">




                                <CardHeader className="flex flex-col items-center text-center pb-2">
                                    <Avatar className="h-24 w-24 mb-4">
                                        <AvatarImage src={blurProfile?.secureUrl || ""} alt={CachedUser.name!} />
                                        <AvatarFallback>
                                            {CachedUser.name!
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                            }
                                        </AvatarFallback>
                                    </Avatar>
                                    <CardTitle className=" flex  justify-center gap-2 items-center text-xl">{CachedUser.name}
                                    <p className="text-sm mt-1  text-muted-foreground">
                                                        {
                                                            "(" + CachedUser.profile.title+ ")"
                                                        }
                                                    </p>

                                    </CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant={CachedUser.role === "ADMIN" ? "destructive" : "secondary"}>{CachedUser.role}</Badge>
                                        {CachedUser.role === "MEMBER" && <Badge variant="outline">{"silver"}</Badge>}
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
                                            <span>{CachedUser?.profile?.phoneNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>Joined {formatDistanceToNow(new Date(CachedUser?.createdAt), { addSuffix: true })}</span>
                                        </div>
                                        {CachedUser.role === "MEMBER" && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                {/* <span>ID: {CachedUser.MEMBERshipId}</span> */}
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="flex flex-col gap-1">
                                        {
                                            CachedUser.profile && (
                                                <>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            CachedUser.profile.bio
                                                        }
                                                    </p>
                                                   
                                                    <div className="flex flex-col">
                                                        {
                                                            CachedUser.profile.website &&
                                                            <div className="text-sm ">
                                                                <div className="flex flex-row justify-start items-center gap-2 ">
                                                                    <p>
                                                                        links :
                                                                    </p>

                                                                    {
                                                                        Object.keys(CachedUser.profile.website).map((website: string, i: number) => {
                                                                              const link  =  CachedUser.profile.website as  Record<string , string>
                                                                           return  <Link
                                                                                style={{

                                                                                }}
                                                                                className=" text-sm capitalize"
                                                                                href={
                                                                                    CachedUser.profile.website && link[website] || ""
                                                                                }
                                                                                key={i}>
                                                                                {
                                                                                    website
                                                                                }


                                                                            </Link>
                                                                        }
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>

                                                </>
                                            )

                                        }

                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-2">
                                    <Button
                                        onClick={() => {
                                            router.push(`/profile/${CachedUser.id}/editprofile`)

                                        }}

                                        variant="outline"
                                        className="w-full" size="sm">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Profile
                                    </Button>

                                    {
                                        CachedUser.role === "ADMIN" && (
                                            <Button
                                                onClick={() => {
                                                    router.push(`/profile/${CachedUser.id}/managebooks`)

                                                }}
                                                variant="outline" className="w-full" size="sm">
                                                <Library className="mr-2 h-4 w-4" />
                                                manage books
                                            </Button>
                                        )
                                    }
                                </CardFooter>

                            </Card>
                        }

                        {/* Right column - role specific content */}

                        {

                            children
                        }
                    </div>
                </div>
            </div>

        </>

    )
}

