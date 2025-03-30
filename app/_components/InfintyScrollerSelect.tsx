"use client";

import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface InfiniteScrollSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  isLoading: boolean;
  categories: Category[];
  loadMore: () => void;
  country?: boolean;
  hasMore: boolean;
  label: string;
  placeholder?: string; // Add placeholder prop
}

const InfiniteScrollSelect: React.FC<InfiniteScrollSelectProps> = ({
  control,
  name,
  country,
  categories,
  loadMore,
  hasMore,
  label,
  placeholder = "Select an option", // Default placeholder
}) => {
  const [, setIsOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name as unknown as never}
      render={({ field }) => (
        <FormItem className="min-w-[200px]">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
            
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
              onOpenChange={(open) => setIsOpen(open)}
            >
              <SelectTrigger className="min-w-full">
                <SelectValue placeholder={placeholder} /> {/* Use placeholder prop */}
              </SelectTrigger>
              <SelectContent>
                <InfiniteScroll
                  pageStart={0}
                  loadMore={loadMore}
                  hasMore={hasMore}
                  loader={
                    <div className="p-2 text-center w-full flex justify-center items-center" key="loader">
                      <Loader2 className="animate-spin w-4 h-4" />
                    </div>
                  }
                  useWindow={false}
                >
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={country ? category.name : category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </InfiniteScroll>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InfiniteScrollSelect;