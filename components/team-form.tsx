'use client'
import React, { FormEvent } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react'
import toast from 'react-hot-toast'
import { updateUser } from '@/actions/user-actions'
interface ProviderFormProps {
  cleanData: () => void
  isEdit: boolean
  isOpen: boolean
  isReadOnly: boolean
  onClose: () => void
  onOpenChange: () => void
  onSave: () => void
  selectedProvider:
    | {
        id: string
        name: string
        status: boolean | null
        createdAt: Date | null
        updatedAt: Date | null
        type: string
        mainAddress: string
        secondAddress: string
        contactInformation: string
        phoneNumber: string
      }
    | undefined
}
export default function TeamForm({
  cleanData,
  isOpen,
  onOpenChange,
  onSave,
  isEdit,
  isReadOnly,
  selectedProvider,
}: ProviderFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (isEdit && selectedProvider) {
      formData.append('id', selectedProvider.id)
      return await updateUser(formData)
    }
    return await updateUser(formData as any)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='top-center'
        isDismissable={false}
      >
        <form
          onSubmit={(e) =>
            toast.promise(handleSubmit(e), {
              loading: 'Loading',
              success: 'Provider saved successfully!',
              error: (err) => err.message,
            })
          }
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  {isReadOnly
                    ? 'View Provider'
                    : !isEdit
                      ? 'Create a Provider'
                      : 'Edit Provider ' + selectedProvider?.name}
                </ModalHeader>
                <ModalBody>
                  <Input
                    isReadOnly={isReadOnly}
                    name='name'
                    autoFocus
                    label='Provider Name'
                    placeholder='Enter a name for your provider'
                    variant='bordered'
                    defaultValue={isEdit ? selectedProvider?.name : undefined}
                    isRequired
                  />
                  <Input
                    isReadOnly={isReadOnly}
                    name='contactInformation'
                    label='Contact Information'
                    variant='bordered'
                    placeholder='Enter contact information'
                    defaultValue={
                      isEdit ? selectedProvider?.contactInformation : undefined
                    }
                  />
                  <div className='flex justify-between px-1 py-2'>
                    <Input
                      isReadOnly={isReadOnly}
                      name='type'
                      label='Type'
                      variant='bordered'
                      placeholder='Enter a type'
                      defaultValue={isEdit ? selectedProvider?.type : undefined}
                    />
                    <Input
                      isReadOnly={isReadOnly}
                      name='phoneNumber'
                      label='Phone Number'
                      variant='bordered'
                      placeholder='Enter a type'
                      defaultValue={
                        isEdit ? selectedProvider?.phoneNumber : undefined
                      }
                    />
                  </div>
                  <Input
                    isReadOnly={isReadOnly}
                    name='mainAddress'
                    label='Main Address'
                    variant='bordered'
                    placeholder='Enter Main Address'
                    defaultValue={
                      isEdit ? selectedProvider?.mainAddress : undefined
                    }
                  />
                  <Input
                    isReadOnly={isReadOnly}
                    name='secondAddress'
                    label='Second Address'
                    variant='bordered'
                    placeholder='Enter Second Address'
                    defaultValue={
                      isEdit ? selectedProvider?.secondAddress : undefined
                    }
                  />
                </ModalBody>
                <ModalFooter>
                  {!isReadOnly ? (
                    <>
                      {' '}
                      <Button
                        color='danger'
                        variant='light'
                        onPress={() => {
                          onClose()
                          cleanData()
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        color='primary'
                        variant='ghost'
                        type='submit'
                        onPress={() => {
                          onSave()
                          onClose()
                        }}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        color='primary'
                        variant='ghost'
                        onPress={() => {
                          onClose()
                          cleanData()
                        }}
                      >
                        Close
                      </Button>
                    </>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}