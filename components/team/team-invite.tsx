'use client'
import { invite } from "@/actions/auth-actions";
import { Button, Card, CardBody, CardHeader, Input, Modal, ModalContent } from "@nextui-org/react";
import { startTransition } from "react";
import { render } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
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
    const onSubmit = handleSubmit((ctx) =>
        startTransition(() => {
            toast.promise(
                invite(ctx.email),
                {
                    pending: 'Sending invitation...',
                    success: {
                        render({ data }) {
                            return `${data}`
                        },
                        icon:false,
                    },
                    error: {
                        render({data}) {
                            return `${data}`
                        }
                    },
                }
            )

        }))
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement='top-center'
            isDismissable
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
                                <div className="flex  items-center flex-wrap md:flex-nowrap pb-4 gap-4">
                                    <Input {...register("email")} size="sm" type="email" label="Email" className="max-w-[350px]" />
                                    <Button size="sm" type="submit" onPress={onClose}>
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