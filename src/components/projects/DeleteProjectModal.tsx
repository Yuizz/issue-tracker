import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { Trash } from 'lucide-react'
import React from 'react'
import { api } from '~/utils/api'

type Props = {
  projectId: string
  projectName: string
  isIconOnly?: boolean
}

function DeleteProjectModal({ projectId, projectName, isIconOnly = false }: Props) {
  const utils = api.useContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const deleteProject = api.projects.delete.useMutation({
    onSuccess: async () => {
      await utils.projects.getByUser.invalidate()
      console.log("Project deleted")
    },
    onError: () => {
      console.error("Error trying to delete the project")
    }
  })

  const onDelete = () => {
    deleteProject.mutate(projectId)
    onClose()
  }

  return (
    <>
      {isIconOnly ? (
        <Trash className="cursor-pointer" size={15} onClick={onOpen} />
      ) : (
        <Button color="danger" onClick={onOpen}>Delete</Button>
      )}

      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{`Delete project ${projectName}`}</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this project?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={onDelete}
              isLoading={deleteProject.isLoading}
            >Delete</Button>
            <Button
              color="default"
              onPress={onClose}
              variant="ghost"
              autoFocus>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeleteProjectModal