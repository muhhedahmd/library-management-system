"use client"

import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

const InnerBody = ({
    children
}: {
    children: React.ReactNode
}) => {
    const { open } = useSidebar()
    const [isMounting, setIsMounting] = useState(false)
    const [windowWidth, setWindowWidth] = useState(0)

    useEffect(() => {
        setIsMounting(true)

        // Set initial window width
        setWindowWidth(window.innerWidth)

        // Add resize listener
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    if (!isMounting) return null

    // const getWidth = () => {
    //     if (windowWidth <= 1400) {
    //         return open ? '15.4%' : '0'

    //     } else if (windowWidth >= 1400) {
    //         return open ? '9%' : '0'
    //     } else {
    //         return open ? '5%' : '0'
    //     }
    // }
    const getMargin = () => {
        if (windowWidth <= 1400) {
            return open ? '15.4%' : '0'
        } else if (windowWidth >= 1400) {
            return open ? '9%' : '0'
        } else {
            return open ? '5%' : '0'
        }
   


        // if (windowWidth >= 1336) {
        //     return open ? '10%' : '4rem'
        // } else if (windowWidth >= 1080) {
        //     return open ? '14%' : '4%'
        // } else {
        //     return open ? '14%' : '3%'
        // }
    }

    return (
        <div
            style={{
                marginLeft: open ? getMargin() : 0 ,
                // width:"70%"
            }}
            className={cn(

                " block md:flex transition-[margin-left] w-full max-w-[100vw] duration-300 mx-auto flex-col justify-start items-center",
            )}>
            {children}
        </div>
    )
}

export default InnerBody