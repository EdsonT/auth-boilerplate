'use client'
import { invite } from "@/actions/auth-actions";
import { Button, Card, CardBody, CardHeader, Input, Modal, ModalContent } from "@nextui-org/react";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
interface TeamInviteProps {
    isOpen: boolean,
    onOpenChange: () => void,
}
type FormData = {
    email: string
  }
export default function TeamInvite({ isOpen, onOpenChange }: TeamInviteProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<FormData>()
      const onSubmit = handleSubmit((data) =>
        startTransition(() => {
            invite(data.email)
        }))
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement='top-center'
            // isDismissable={false}
            hideCloseButton
            className="max-w-[400px]"
        >

            <ModalContent className="items-center justify-between ">
                {(onClose) => (
                    <Card className="w-full " >
                        <CardHeader>
                            <h1 className="font-medium text-large">Invite Someone</h1>
                        </CardHeader>
                        <CardBody className="w-full ">
                            <form onSubmit={onSubmit} >
                                <div className="flex  items-center flex-wrap md:flex-nowrap  gap-4">           
                                    <Input {...register("email")} size="sm" type="email" label="Email" className="max-w-[350px]" />
                                    <Button size="sm" type="submit">
                                        Send Invite
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                )}
            </ModalContent>
        </Modal>
    )
}