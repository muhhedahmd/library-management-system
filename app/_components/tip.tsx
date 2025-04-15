import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  

  import React from 'react'
  
  const Tip = ({
    trigger,
    content,
  } : { trigger: React.ReactNode, content: React.ReactNode}) => {
    return (
      <TooltipProvider>
  <Tooltip >
    <TooltipTrigger >{
        trigger
  }</TooltipTrigger>
    <TooltipContent className=" p-0 bg-muted rounded-xl">
      {
        content
      }
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
    )
  }
  
  export default Tip
