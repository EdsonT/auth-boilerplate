import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
  } from '@nextui-org/react'
  
  export default function ConfirmationDialog(props: any) {
    return (
      <Modal
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        title='Confirmation'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirmation</ModalHeader>
              <ModalBody>{props.message}</ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Cancel
                </Button>
                <Button color='default' onPress={() => props.onPress()}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
  }