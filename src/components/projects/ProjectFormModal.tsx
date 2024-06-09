/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Textarea, useDisclosure } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { CreateProjectSchema } from "~/schemas"
import { FolderPlus, SettingsIcon } from "lucide-react";
import { useEffect } from "react";

type Props = {
  initialData?: {
    id: string
    name: string
    description: string | null
    isPublic: boolean
  },
  isIconOnly?: boolean
}

export default function ProjectFormModal({ initialData, isIconOnly }: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof CreateProjectSchema>>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      ...initialData,
      description: initialData?.description ?? ""
    }
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  const onCloseModal = () => {
    reset()
    onClose()
  }

  const createProject = api.projects.create.useMutation({
    onSuccess: () => {
      onCloseModal()
    },
    onError: () => {
      console.error("error trying to create the project")
    }
  })

  const updateProject = api.projects.update.useMutation({
    onSuccess: () => {
      onCloseModal()
    },
    onError: () => {
      console.error("error trying to update the project")
    }
  })

  const onSubmit = handleSubmit((data) => {
    if (initialData) {
      updateProject.mutate({
        id: initialData.id,
        ...data
      })
    } else {
      createProject.mutate(data)
    }
  })

  return <>
    {isIconOnly ?
      (initialData
        ? <SettingsIcon size={15} onClick={onOpen} className="cursor-pointer" />
        : <FolderPlus size={15} onClick={onOpen} className="cursor-pointer" />
      )
      :
      <Button onPress={onOpen} color="primary" startContent={initialData ? <SettingsIcon /> : <FolderPlus />}>
        {initialData ? "Editar proyecto" : "Agregar proyecto"}
      </Button>
    }

    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        <>
          <ModalHeader>
            {
              initialData
                ? `Editar proyecto ${initialData.name}`
                : "Agregar proyecto"
            }
          </ModalHeader>
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
              <Button color="danger" variant="flat" onPress={onCloseModal}>Cancelar</Button>
              <Button color="primary" type="submit" isLoading={createProject.isLoading || updateProject.isLoading}>
                {initialData ? "Actualizar" : "Agregar"}
              </Button>
            </ModalFooter>
          </form>
        </>
      </ModalContent>
    </Modal>
  </>;
}