import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Textarea, useDisclosure } from "@nextui-org/react";
import { IoMdAdd } from "react-icons/io";
import { api } from "~/utils/api";

export default function AddProjectModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const createProject = api.projects.create.useMutation({
    onSuccess: () => {
      onClose()
      console.log("success")
    },
    onError: () => {
      console.log("error")
    }
  })

  return <>
    <Button onPress={onOpen} color="primary" startContent={<IoMdAdd />}>Agregar proyecto</Button>

    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Agregar proyecto</ModalHeader>
            <ModalBody>
              <form onSubmit={(event) => console.log(event)}>
                <div className="flex flex-col gap-4">

                  <Input
                    autoFocus
                    label="Nombre del proyecto"
                    placeholder="Issue Tracker"
                    variant="bordered"
                  />
                  <Textarea
                    label="Descripción"
                    placeholder="Un sistema de seguimiento de problemas"
                    variant="bordered"
                  />
                  <Switch color="success" size="sm">
                    <span className="font-semibold">Proyecto público</span>
                  </Switch>
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>Cancelar</Button>
              <Button color="primary" onPress={() => console.log("hello")}>Agregar</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  </>;
}