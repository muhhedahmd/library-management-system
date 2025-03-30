"use client"

import { useEffect, useMemo, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2 } from "lucide-react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useCreateAuthorMutation } from "@/store/QueriesApi/authorApi"

import countryList from 'react-select-country-list'
import InfiniteScrollSelect from "@/app/_components/InfintyScrollerSelect"
import { toast } from "sonner"

const authorFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  bio: z.string().optional(),
  nationality: z.string().optional(),
  birthdate: z.date().optional(),
})

type AuthorFormValues = z.infer<typeof authorFormSchema>

interface AuthorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthorDialog({ open, onOpenChange }: AuthorDialogProps) {

  const [create, { isLoading, }] = useCreateAuthorMutation()
  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      name: "",
      bio: "",
      nationality: "",
      birthdate: undefined,
    },
  })

  const allCountries = useMemo(() => countryList().getData(), []); // Get all countries
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false)
  const limit = 10; // Number of countries to load per page

  // Paginate the country data


  // Check if there are more countries to load

  const paginatedCountries = allCountries.slice(0, page * limit);
  useEffect(() => {
    const IshasMore = paginatedCountries.length < allCountries.length;
    setHasMore(IshasMore)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, setHasMore])
  // const hasMore = paginatedCountries.length < allCountries.length;

  // Load more countries
  const loadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  async function onSubmit(data: AuthorFormValues) {

    if (!(await form.trigger())) return

    try {

      create({
        body: {
          bio : data.bio ,
          birthdate :new Date(data?.birthdate || new Date()) ,
          name : data.name, 
          nationality : data.nationality
        }
      })

      toast.success("Author created", {
        description: "The author has been created successfully.",
      })

      // Reset form
      form.reset()

      // Close dialog
      onOpenChange(false)

      // Notify parent component
    } catch (error) {
      console.error(error)
      toast.error("Error", {
        description: "An error occurred while creating the author.",

      })
    } finally {

    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Author</DialogTitle>
          <DialogDescription>Create a new author for your library. Fill in the details below.</DialogDescription>
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


            <InfiniteScrollSelect
            label="Nationality"
              categories={paginatedCountries.map((country) => ({
                id: country.value, // Use country code as the ID
                name: country.label, // Use country name as the label
              }))}
              control={form.control}
              hasMore={hasMore}
              country={true}
              isLoading={false} // Set to true if loading from an API
              loadMore={loadMore}
              name="nationality"
            />

            {/* <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} */}
            {/* /> */}

            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Birthdate</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          disabled={isLoading}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ""} disabled={isLoading} className="min-h-32" />
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
                Create Author
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

