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
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/components/ui/use-toast"

import { toast } from 'sonner';
import { useCreateCategoryMutation } from "@/store/QueriesApi/categoryApi"
const categoryFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // onCategoryCreated: (category: { id: string; name: string }) => void
}

export function CategoryDialog({ open, onOpenChange }: CategoryDialogProps) {

  // const [isLoading, setIsLoading] = useState(false)
  const [create,{isLoading ,}] = useCreateCategoryMutation()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function onSubmit(data: CategoryFormValues) {
    // setIsLoading(true)
    if(!(await form.trigger())) return 

    try {
      await create({
        body : {
          name  :data.name,
          description  :data.description,
          
        }
      })

    //   toast({
    //     title: "Category created",
    //     description: "The category has been created successfully.",
    //   })

      // Reset form
      form.reset()

      // Close dialog
      onOpenChange(false)

      // Notify parent component
      // onCategoryCreated(category)
    } catch (error) {
      console.error(error)
      // toast({
      //   title: "Error",
      //   description: "An error occurred while creating the category.",
      //   variant: "destructive",
      // })
    } finally {
      // setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>Create a new category for your library. Fill in the details below.</DialogDescription>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ""} disabled={isLoading} className="min-h-24" />
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
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

