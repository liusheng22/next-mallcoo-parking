'use client'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

interface Props {
  title: string
  body: string
  confirmDelHandle: () => void
}

const ConfirmModal = forwardRef((props: Props, ref) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    setTitle(props.title)
    setBody(props.body)
  }, [props.title, props.body])

  // 将子组件的方法暴露给父组件
  useImperativeHandle<any, any>(ref, () => ({
    onOpen
  }))

  const onConfirm = () => {
    console.log('onConfirm')
    onClose()
    props.confirmDelHandle()
  }

  return (
    <Modal
      isOpen={isOpen}
      placement="bottom-center"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <p>{body}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={() => onConfirm()}>
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
})

export default ConfirmModal
