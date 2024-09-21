import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react'
import React from 'react'
import type { IssueResponse } from '~/server/api/routers/issues';
import IssueModal from './IssueModal';
import { Issue } from '@prisma/client';

const columns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "dueDate",
    label: "Due Date",
  },
  {
    key: "actions",
    label: "Actions"
  }
]

const statusColorMap: Record<string, "success" | "warning" | "secondary"> = {
  done: 'success',
  pending: 'warning',
  inProgress: 'secondary',
}

type ValidStatus = "done" | "inProgress" | "todo" | "cancelled"

function IssuesTable({ issues }: { issues: IssueResponse[] }) {
  const renderCell = React.useCallback((item: IssueResponse, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof IssueResponse];
    let value

    switch (columnKey) {
      case 'dueDate':
        value = cellValue as Date | null;
        if (!value) return '';

        const day = String(value.getUTCDate()).padStart(2, "0");
        const month = String(value.getUTCMonth() + 1).padStart(2, "0");
        const year = value.getUTCFullYear();

        return `${day}/${month}/${year}`
      case 'status':
        value = cellValue as keyof typeof statusColorMap;
        return (
          <Chip className="capitalize" color={statusColorMap[value]} size="sm">
            {value}
          </Chip>
        )
      case 'actions':
        const status = item.status as ValidStatus
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit issue">
              <IssueModal initialData={{
                ...item,
                description: item.description as string,
                status
              }} isIconOnly />
            </Tooltip>
          </div>
        )
      default: return cellValue?.toString();
    }
  }, [])

  return (
    <Table aria-label="Pending Issues Table" shadow="none">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={issues}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default IssuesTable