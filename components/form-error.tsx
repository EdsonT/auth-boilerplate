import { Icon } from "@iconify/react";

interface FormErrorsProps{
    message?:string,
}

export const FormErrors = ({message}:FormErrorsProps)=>{
    if(!message) return null
    return(
        <div className="bg-destructive/15 p-3  rounded-md flex items-center gap-x-2 text-sm text-destructive">
            <Icon icon={"lucide:error"} height={10} width={10} stroke="2"/>
            <p>{message}</p>
        </div>
    )
}