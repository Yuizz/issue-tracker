/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, Textarea, useDisclosure } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { CreateIssueSchema, type UpdateIssueSchema } from "~/schemas"
import { BadgeAlert, SettingsIcon } from "lucide-react";
import { useEffect } from "react";

type Props = {
  initialData?: z.infer<typeof UpdateIssueSchema>,
  projectId?: string
  isIconOnly?: boolean
}

export default function IssueModal({ initialData, projectId, isIconOnly }: Props) {
  const utils = api.useContext()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof CreateIssueSchema>>({
    resolver: zodResolver(CreateIssueSchema),
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

  const createIssue = api.issues.create.useMutation({
    onSuccess: async () => {
      await utils.issues.getByProject.invalidate()
      onCloseModal()
    },
    onError: () => {
      console.error("error trying to create the issue")
    },
  })

  const updateIssue = api.issues.update.useMutation({
    onSuccess: async () => {
      if (initialData) await utils.issues.invalidate()
      onCloseModal()
    },
    onError: () => {
      console.error("error trying to update the project")
    }
  })

  const onSubmit = handleSubmit((data) => {
    if (initialData) {
      updateIssue.mutate({
        id: initialData.id,
        ...data
      })
    } else if (projectId) {
      createIssue.mutate({ ...data, projectId })
    } else {
      console.error("projectId is required")
    }
  })

  return <>
    {isIconOnly ?
      (initialData
        ? <SettingsIcon size={15} onClick={onOpen} className="cursor-pointer" />
        : <BadgeAlert size={15} onClick={onOpen} className="cursor-pointer" />
      )
      :
      <Button onPress={onOpen} color="primary" startContent={initialData ? <SettingsIcon /> : <BadgeAlert />}>
        {initialData ? "Edit issue" : "New issue"}
      </Button>
    }

    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        <>
          <ModalHeader>
            {
              initialData
                ? `Edit issue ${initialData.name ?? ""}`
                : "New issue"
            }
          </ModalHeader>
          <form onSubmit={onSubmit}>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <input
                  type="hidden"
                  {...register("projectId")}
                />

                <Input
                  autoFocus
                  label="Name of the issue"
                  placeholder="Issue #1"
                  variant="bordered"
                  isRequired
                  isInvalid={!!errors.name}
                  errorMessage={errors?.name && errors.name.message}
                  {...register("name")}
                />
                <Textarea
                  label="Description"
                  placeholder="Something is not working as expected..."
                  variant="bordered"
                  isRequired
                  isInvalid={errors.description !== undefined}
                  errorMessage={errors.description?.message}
                  {...register("description")}
                />

                <Input
                  label="Due date"
                  type="date"
                  variant="bordered"
                  isRequired
                  isClearable
                  isInvalid={errors.dueDate !== undefined}
                  errorMessage={errors.dueDate?.message}
                  {...register("dueDate")}
                />

                <Select
                  label="Status"
                  variant="bordered"
                  isRequired
                  isInvalid={errors.status !== undefined}
                  errorMessage={errors.status?.message}
                  items={[{ value: "todo" }, { value: "done" }, { value: "cancelled" }, { value: "inProgress" }]}
                  defaultSelectedKeys={[initialData?.status ?? "todo"]}
                  {...register("status")}
                >
                  {({ value }) => <SelectItem key={value} value={value}>{value}</SelectItem>}
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onCloseModal}>Cancel</Button>
              <Button color="primary" type="submit" isLoading={createIssue.isLoading || updateIssue.isLoading}>
                {initialData ? "Update" : "Create"}
              </Button>
            </ModalFooter>
          </form>
        </>
      </ModalContent>
    </Modal>
  </>;
}