"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCreatePublisherMutation } from "@/store/QueriesApi/publisherApi"
import { toast } from "sonner"
// import { useToast } from "@/components/ui/use-toast"

const publisherFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
})

type PublisherFormValues = z.infer<typeof publisherFormSchema>

interface PublisherDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PublisherDialog({ open, onOpenChange }: PublisherDialogProps) {
      const [create,{isLoading ,}] = useCreatePublisherMutation()

    const form = useForm<PublisherFormValues>({
        resolver: zodResolver(publisherFormSchema),
        defaultValues: {
            name: "",
            website: "",
        },
    })
    async function onSubmit(data: PublisherFormValues) {
        if(!(await form.trigger())) return 

        try {
          await create({
            body : {
              name  :data.name,
              website  :data.website,
              
            }
          })
              toast.success( "Publisher created" , {
                // title: ,
                description: "The publisher has been created successfully.",
              })

            // Reset form
            form.reset()

            // Close dialog
            onOpenChange(false)

            // Notify parent component

        } catch (error) {
            console.error(error)
              toast.error("Error" ,{
                description: "An error occurred while creating the publisher.",
              })
        } finally {

        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Publisher</DialogTitle>
                    <DialogDescription>Create a new publisher for your library. Fill in the details below.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="url" placeholder="https://example.com" disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Publisher
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

