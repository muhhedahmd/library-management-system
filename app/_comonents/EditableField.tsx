
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import React from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { ProfileSchema } from './ZodScheams';

const EditableField = ({
  name,
  className,
  icon,
  label,
  placeholder,
  type = "text",
  editStatus,
  control,
}: {
  className?: string;
  name: keyof z.infer<typeof ProfileSchema>;
  icon: React.ReactNode;
  label: string;
  type?: string;
  placeholder: string;
  editStatus: boolean;
  control: Control<z.infer<typeof ProfileSchema>>;
}) => {
  return (
    <div className={className}>
      <FormField
        // disabled={editStatus}
        name={name}
        control={control}
        render={({ field }) => (
          <FormItem className="space-y-2 relative">
            <FormLabel className="flex items-center gap-2">
              {icon}
              {label}
            </FormLabel>
            <FormControl>
              {type === "textarea" ? (
                <Textarea
                  // disabled={editStatus}
                  placeholder={placeholder}
                  {...field}
                />
              ) : type === "date" ? (
                <Input
                  // disabled={editStatus}
                  type="date"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) => {
                    field.onChange(new Date(e.target.value));
                  }}
                />
              ) : (
                <Input
                  // disabled={editStatus}
                  type={type}
                  placeholder={placeholder}
                  {...field}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default EditableField;