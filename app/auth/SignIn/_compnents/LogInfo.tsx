"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, User, Lock, LucideUserSquare, Settings2 } from "lucide-react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { signIn } from "next-auth/react"
import { GenderSelect } from "./SelectGender"
import { GENDER, UserRole } from "@prisma/client"
import { RoleSelect } from "./SelectRole"
import LogIn from "./LogIn"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  Role : z.enum([UserRole.ADMIN  ,UserRole.MEMBER  ]),
  grnder: z.enum([GENDER.FEMALE  ,GENDER.MALE  ]),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters").optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})


type FormData = z.infer<typeof formSchema>

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [tabState, setTabState] = useState("register")
  const [GenderValue, setGenderValue] = useState<GENDER>("MALE")
  const [RoleValue, setRoleValue] = useState<UserRole>("MEMBER")
  const {

    register,
    handleSubmit,
    trigger,
    formState: { errors },
    
    reset,
    setValue
  } = useForm<FormData>({
    
    resolver: zodResolver(formSchema),
    defaultValues: {
      Role :"MEMBER" ,
      grnder :"MALE",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    
    },
  })


  useEffect(()=>{
    setValue("grnder" , GenderValue)
  } ,[GenderValue])
  useEffect(()=>{
    setValue("Role" , RoleValue)
  } ,[RoleValue])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Form Data:", data)
    if (await trigger()) {
      console.log({data})
      await signIn("signup", {
        redirect: true,
        ...data , 
        gender : GenderValue , 
        role : RoleValue
        ,
      }).then((res) => {
        console.log(res)
      }).catch((err) => {

        console.log(err)
      })
    
    reset()
  }

}

  return (
    <div className={cn("flex mt-[0vh] items-center justify-center p-4", tabState === "login" && "mt-[15vh]")}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>Create an account or login to continue</CardDescription>
        </CardHeader>
        <Tabs onValueChange={(e) => setTabState(e)} defaultValue="register">
          <TabsList className="grid m-auto mt-0 mb-0 w-[90%] grid-cols-2">
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>
          <TabsContent value="register">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">

                    <Input
                      id="name"
                      placeholder="Enter your name"
                      className="pl-8 text-sm"
                      {...register("name")}
                    />
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="flex justify-between items-center gap-4">

                  <div className="space-y-2">
                  <div className="flex justify-start items-center gap-2">
                  <LucideUserSquare className="w-4 h-4" />
                      <Label htmlFor="Gender">Gender</Label>
                    </div>
                    <GenderSelect
                      GenderValue={GenderValue}
                      SetGenderValue={setGenderValue}

                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-start items-center gap-2">


                      <Settings2
                        className="w-4 h-4"
                      />
                      <Label htmlFor="Role">Role</Label>

                    </div>
                    <RoleSelect
                      RoleValue={RoleValue}
                      SetRoleValue={setRoleValue}

                    />
                  </div>

                </div>

                <div className="space-y-2 mt-[-.4rem]">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-8 text-sm"
                      {...register("email")}
                    />
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>


                <div className="flex justify-start items-center gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-8 pr-8 text-sm"
                        {...register("password")}
                      />
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        className="pl-8 pr-8 text-sm"
                        {...register("confirmPassword")}
                      />
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full mt-5">
                  Create Account
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="login">
        <LogIn />
          </TabsContent>
        </Tabs>
        <div className="mt-0 text-center text-sm">
          <span className="text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="#" className="text-sm text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-sm text-primary hover:underline">
              Privacy Policy
            </Link>
          </span>
        </div>
      </Card>
    </div>
  )
}