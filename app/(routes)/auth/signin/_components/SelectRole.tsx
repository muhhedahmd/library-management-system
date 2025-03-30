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
import {  UserRole } from "@prisma/client"

export function RoleSelect( {
    RoleValue  ,
    SetRoleValue
} :{
    RoleValue : UserRole
    SetRoleValue  :React.Dispatch<React.SetStateAction<UserRole>>
}) {

  return (
    <Select defaultValue="MEMBER" value={RoleValue} onValueChange={(item :UserRole )=> SetRoleValue(item )}>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="MEMBER" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Role</SelectLabel>
          <SelectItem value="MEMBER">MEMBER</SelectItem>
          <SelectItem value="ADMIN">ADMIN</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
