import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GENDER } from "@prisma/client"

export function GenderSelect( {
    GenderValue  ,
    SetGenderValue
} :{
    GenderValue : GENDER
    SetGenderValue  :React.Dispatch<React.SetStateAction<GENDER>>
}) {
  return (
    <Select defaultValue="MALE" value={GenderValue} onValueChange={(item :GENDER )=> SetGenderValue(item )}>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Gender</SelectLabel>
          <SelectItem value="MALE">MALE</SelectItem>
          <SelectItem value="FEMALE">FEMALE</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
