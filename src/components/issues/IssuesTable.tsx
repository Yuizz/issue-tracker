import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react'
import React from 'react'
import type { IssueResponse } from '~/server/api/routers/issues';
import IssueModal from './IssueModal';

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

function IssuesTable({ issues }: { issues: IssueResponse[] }) {
  const renderCell = React.useCallback((item: IssueResponse, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof IssueResponse];
    let value

    switch (columnKey) {
      case 'dueDate':
        value = cellValue as string | null;
        if (!value) return '';
        return new Date(value).toLocaleDateString();
      case 'status':
        value = cellValue as keyof typeof statusColorMap;
        return (
          <Chip className="capitalize" color={statusColorMap[value]} size="sm">
            {value}
          </Chip>
        )
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit issue">
              <IssueModal initialData={item} isIconOnly />
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