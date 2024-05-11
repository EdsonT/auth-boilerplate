"use client"
import { signOut } from "next-auth/react";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";

export function SignOutButton(){
    return <Button 
    color="danger" 
    size="md" 
    variant="light" 
    startContent={<Icon icon='lucide:log-out'/>} 
    onClick={()=>signOut()}
    >Log Out</Button>

}