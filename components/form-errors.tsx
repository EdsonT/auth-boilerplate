'use client'
import { Icon } from "@iconify/react";

interface FormErrorsProps{
    message?:string,
}

export const FormErrors = ({message}:FormErrorsProps)=>{
    if(!message) return null
    return(
        <div className="transition ease-in-out bg-danger-100 flex items-center p-2 gap-x-2  text-sm rounded-md text-danger">
            <Icon icon='lucide:shield-off' className="stroke-1 h-8 w-8" />
            <p>{message}</p>
        </div>
    )
}