"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Trash2, Save, ZapIcon } from "lucide-react"
import { EditedUserPrefrances } from "@/Types"
import { cn } from "@/lib/utils"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
// import { useToast } from "@/components/ui/use-toast"

interface PreferenceItemProps {
    isComp: EditedUserPrefrances | undefined
    id: string
    name?: string
    category?: {
        id: string
        name: string
    } | null,
    author?: {
        id: string
        name: string
    } | null,
    authorId?: string | null
    categoryId?: string | null
    type: "category" | "author" | "comp"
    weight: number
    entityId?: string
    onUpdate: () => void
}

export default function PreferenceItem({
    author,
    category,
     isComp, id, name, type, weight, entityId, onUpdate }: PreferenceItemProps) {
    const [currentWeight, setCurrentWeight] = useState(weight)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)
    const [openAlertDialog ,setopenAlertDialog ] = useState(false)

    const handleWeightChange = (value: number[]) => {
        setCurrentWeight(value[0])
        setHasChanged(value[0] !== weight)
    }

    const handleSave = async () => {

        console.log(process.env.NEXT_PUBLIC_API! + "api/user/preferances")
        try {
            setIsUpdating(true)
            const response = await fetch(process.env.NEXT_PUBLIC_API! + "api/users/preferances", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type,
                    categoryId: entityId,
                    authorId: entityId,
                    userPreferenceId: id,
                    weight: currentWeight,
                }),
            })

            if (response.ok) {
                // toast({
                //   title: "Preference updated",
                // //   description: `Your preference for ${name} has been updated.`,
                // })
                setHasChanged(false)
                onUpdate()
            }
        } catch (error) {
            console.log(error)
            //   toast({
            //     title: "Error",
            //     // description: "Failed to update preference. Please try again.",
            //     variant: "destructive",
            //   })
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        onUpdate()
        try {
            setIsDeleting(true)
            const response = await fetch(process.env.NEXT_PUBLIC_API! +`api/users/preferances/${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                onUpdate()
                setopenAlertDialog(false)

                // toast({
                //     title: "Preference removed",
                //     //   description: `Your preference for ${name} has been removed.`,
                // })
                
            } else {
                throw new Error("Failed to delete preference")
            }
            onUpdate()
        } catch (error) {
            console.log(error)

            // toast({
            //     title: "Error",
            //     // description: "Failed to remove preference. Please try again.",
            //     variant: "destructive",
            // })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            {
                type !== "comp" ?
                    <div className="flex flex-col space-y-2 p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                            {
                                isComp ?
                                    <div
                                        className=" flex flex-col justify-start items-start  gap-3"
                                    >
                                        <div className={cn("font-medium truncate",
                                            type !== "author" && "text-sm text-muted-foreground"

                                        )} title={name}>
                                            Author : {isComp.author?.name}
                                        </div>
                                        <div className={cn("font-medium truncate",
                                            type === "author" && "text-sm text-muted-foreground"

                                        )} title={name}>

                                            Category : {isComp.category?.name}
                                        </div>
                                    </div> :

                                    <div className="font-medium truncate"


                                        title={name}>
                                        {name}
                                    </div>
                            }
                            <div className="text-xs text-muted-foreground capitalize">{type}</div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Slider
                                value={[currentWeight]}
                                min={1}
                                max={10}
                                step={1}
                                onValueChange={handleWeightChange}
                                className="flex-1"
                            />
                            <span className="text-sm font-medium w-6 text-center">{Math.ceil(currentWeight)}</span>
                        </div>

                        <div className="flex justify-between pt-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={()=>setopenAlertDialog(true)}
                                disabled={isDeleting || isUpdating}
                                className="h-8 px-2"
                            >
                                <Trash2 className=" text-red-500 h-4 w-4" />
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleSave}
                                disabled={!hasChanged || isUpdating || isDeleting}
                                className="h-8 px-3"
                            >
                                {isUpdating ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                    <Save className="h-4 w-4 mr-1" />
                                )}
                                Save
                            </Button>
                        </div>
                        <div className="flex justify-start items-center text-muted-foreground gap-3">
                            This is Combine edit it form combaine tap<ZapIcon className=" text-yellow-400 fill-amber-500 w-4 h-4" />
                        </div>
                    </div>
                    : <div className="flex flex-col space-y-2 p-3 border rounded-md">
                        <div className="flex justify-between items-center">


                            <div
                                className=" flex flex-col justify-start items-start  "
                            >
                                <div className={cn("font-medium truncate",


                                )} title={author?.name}>
                                    Author : {author?.name}
                                </div>
                                <div className={cn("font-medium truncate",

                                )} title={category?.name}>

                                    Category : {category?.name}
                                </div>
                            </div> 



                        </div>

                        <div className="flex items-center space-x-2">
                            <Slider
                                value={[currentWeight]}
                                min={1}
                                max={10}
                                step={1}
                                onValueChange={handleWeightChange}
                                className="flex-1"
                            />
                            <span className="text-sm font-medium w-6 text-center">{Math.ceil(currentWeight)}</span>
                        </div>

                        <div className="flex justify-between pt-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={()=>setopenAlertDialog(true)}
                                disabled={isDeleting || isUpdating}
                                className="h-8 px-2"
                            >
                                <Trash2 className=" text-red-500 h-4 w-4" />
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleSave}
                                disabled={!hasChanged || isUpdating || isDeleting}
                                className="h-8 px-3"
                            >
                                {isUpdating ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                    <Save className="h-4 w-4 mr-1" />
                                )}
                                Save
                            </Button>
                        </div>
                        <div className="flex justify-start items-center text-muted-foreground gap-3">
                            Combine <ZapIcon className=" text-yellow-400 fill-amber-500 w-4 h-4" />
                        </div>
                    </div>
            }
            <AlertDialog open={openAlertDialog } onOpenChange={setopenAlertDialog} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your preference.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setopenAlertDialog(false)}>Cancel</AlertDialogCancel>
                        <Button disabled={isDeleting} onClick={handleDelete}>{isDeleting ? "Deleting..." : "Delete"}</Button>
                    </AlertDialogFooter>

                </AlertDialogContent>
            </AlertDialog>

        </>

    )
}
