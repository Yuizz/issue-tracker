import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Textarea, useDisclosure } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { CreateProjectSchema } from "~/schemas"
import { FolderPlus } from "lucide-react";

export default function AddProjectModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof CreateProjectSchema>>({ resolver: zodResolver(CreateProjectSchema) })

  const onCloseModal = () => {
    reset()
    onClose()
  }

  const createProject = api.projects.create.useMutation({
    onSuccess: () => {
      onCloseModal()
    },
    onError: () => {
      console.log("error")
    }
  })

  const onSubmit = handleSubmit((data) => {
    createProject.mutate(data)
  })

  console.log(errors)

  return <>
    <Button onPress={onOpen} color="primary" startContent={<FolderPlus />}>Agregar proyecto</Button>

    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Agregar proyecto</ModalHeader>
            <form onSubmit={onSubmit}>
              <ModalBody>
                <div className="flex flex-col gap-4">

                  <Input
                    autoFocus
                    label="Nombre del proyecto"
                    placeholder="Issue Tracker"
                    variant="bordered"
                    isRequired
                    isInvalid={!!errors.name}
                    errorMessage={errors?.name && errors.name.message}
                    {...register("name")}
                  />
                  <Textarea
                    label="Descripción"
                    placeholder="Un sistema de seguimiento de problemas"
                    variant="bordered"
                    isRequired
                    isInvalid={errors.description !== undefined}
                    errorMessage={errors.description?.message}
                    {...register("description")}
                  />
                  <Switch color="success" size="sm" {...register("isPublic")}>
                    <span className="font-semibold">Proyecto público</span>
                  </Switch>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>Cancelar</Button>
                <Button color="primary" type="submit" isLoading={createProject.isLoading}>Agregar</Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  </>;
}