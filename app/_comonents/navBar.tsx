import { CircleUser, Icon, PiIcon } from 'lucide-react'
import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import { DropdownMenuDemo } from './UserLogDropMenuNav'

const NavBar = () => {
    return (
        <div
            className='w-screen border-b-1   flex justify-between items-center pl-8 pr-8 pt-1 pb-1   shadow-sm '
        >
            <PiIcon  className='w-6 h-6'/>

            <div

                className='flex justify-start items-center  gap-5'>
               <DropdownMenuDemo/>
                <ThemeToggle />
            </div>
        </div>
    )
}

export default NavBar