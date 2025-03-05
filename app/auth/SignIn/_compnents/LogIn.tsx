import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2Icon, Lock, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const LogIn = () => {
  const router = useRouter()
  const formSchema = z.object({
    email: z.string().email(
      {
        message: "The email is wrong"
      },
    ),
    password: z.string().min(6, "password is missmatch or wrong")
  })
  type FormData = z.infer<typeof formSchema>


  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger
  } = useForm<FormData>(
    {

      resolver: zodResolver(formSchema),
      defaultValues: {
        //   Role :"MEMBER" ,
        //   grnder :"MALE",
        //   name: "",
        email: "",
        password: "",
        //   confirmPassword: "",

      },
    }

  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const onSubmit: SubmitHandler<FormData> = async (data) => {

    setIsLoading(true)
    if (!(await trigger())) return

    try {

      await signIn("sigin", {
        redirect: false,
        ...data

      }).then((res) => {
        if (res?.ok === true) {
          router.push("/profile")
          setError("Loged in sucessfully")


        }
        const resMsg = JSON.parse(res?.error as unknown as any)
        if (resMsg.ok === false) {

          if (resMsg?.errors?.status !== 200 || resMsg.status !== 201) {

            setError(resMsg.errors.message)
          }
        }
        else {
          console.log(res)
          setError("Loged in sucessfully")

        }
      }).catch((err) => {
        console.log(err)
      })
      console.log(signIn)
      setIsLoading(false)



    } catch (error) {
      setIsLoading(false)
      setError(error as any)
    }
    // console.log(error)

  }
  const [showPassword, setShowPassword] = useState<boolean>(false)
  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      {
        error && error !== "Loged in sucessfully" ? <div className='
text-[#fff]
 pl-3 
 pt-1 
 pb-1
    w-[90%]
    ml-auto 
    mr-auto
rounded-md bg-destructive'>
          InValid  Credentials
        </div>
          : error !== "" && <div className='text-[#fff]
     pl-3 
     pt-1 
     pb-1
        w-[90%]
        ml-auto 
        mr-auto
    rounded-md bg-emerald-500'>
            {error}
          </div>

      }
      <pre>

      </pre>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <div className="relative">
            <Input
              disabled={false}
              id="login-email"
              type="email"
              placeholder="Enter your email"
              className="pl-8 text-sm"
              {...register("email")}
            />
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            <Link href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              disabled={isLoading}
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pl-8 pr-8 text-sm"
              {...register("password")}
            />
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-0 py-0 text-muted-foreground"
              onClick={() => setShowPassword(true)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={isLoading} type="submit" className="w-full mt-4">
          {
            isLoading ?
              <div className='w-full flex justify-center items-center'>
                <Loader2Icon
                  className='w-4 h-4 animate-spin'
                />
              </div>
              : "Sign In"
          }
        </Button>
      </CardFooter>
    </form>
  )
}

export default LogIn