'use client'
import { useDisclosure } from '@nextui-org/react'
import { useState } from 'react'
import React from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import toast from 'react-hot-toast'
import { deleteUser, getTotalUsers, searchUsers } from '@/actions/user-actions'
import DataTable from '../DataTable'
import DataTableHeader from '../DataTableHeader'
import DataTableFooter from '../DataTableFooter'
import TeamForm from './team-form'
import TeamInvite from './team-invite'

const columns = [
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'EMAIL', uid: 'email', sortable: true },
  { name: 'STATUS', uid: 'state', sortable: true },
  { name: 'ROLE', uid: 'role' },
  { name: 'INGRESADO', uid: 'createdAt' },
  { name: 'ACTIONS', uid: 'actions' },
]
interface UsersTableProps {
  data: {
    id: string
    name: string | null
    email: string 
    createdAt: Date | null
    updatedAt: Date | null
    status: boolean | null
    role: string | null
  }[]
  total: number
}
const INITIAL_VISIBLE_COLUMNS = ['name','state','email', 'status', 'role','actions']

export default function ProviderTable({ data, total }: UsersTableProps) {
  const [page, setPage] = React.useState(1)
  const [totalRows, setTotalRows] = React.useState<number>(total)
  const {isOpen, onOpen, onOpenChange } = useDisclosure()
  const [items, setItems] = useState<typeof data>(data)
  const [visibleColumns, setvisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [selectedProvider, setSelectedProvider] = useState<any>(undefined)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isView, setIsView] = useState<boolean>(false)
  const headerColumns = React.useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const onSearch = useDebounceCallback(async (term?: string) => {
    let userItems
    let total: number
    if (term != '' && term != undefined) {
      userItems = await searchUsers(10, page, term)
      total = userItems.length
    } else {
      userItems = await searchUsers(10, page, term)
      total = (await getTotalUsers()) as number
    }
    setItems(userItems)
    setTotalRows(total)
    setPage(1)
  }, 300)
  const onPageChange = async (pNum: number) => {
    const items = await searchUsers(10, pNum)
    setItems(items)
  }

  const onEdit = async (e: any) => {
    setSelectedProvider({ ...e })
    setIsEdit(true)
    onOpen()
  }

  const onView = async (e: any) => {
    setIsEdit(true)
    setIsView(true)
    setSelectedProvider({ ...e })
    onOpen()
  }

  const onDelete = async (e: any) => {
    toast.promise(deleteUser(e), {
      loading: 'Loading',
      success: 'Provider deleted successfully!',
      error: 'Error, cannot delete provider',
    })
    onSearch(' ')
  }

  const reset = () => {
    setIsView(false)
    setIsEdit(false)
    setSelectedProvider(undefined)
  }
  return (
    <>
      <DataTable
        headerColumns={headerColumns}
        items={items}
        actionEdit={onEdit}
        actionView={onView}
        actionDelete={onDelete}
        topContent={
          <DataTableHeader
            columnsFilter={columns}
            onNew={() => onOpen()}
            buttonNewLabel="Invite"
            visibleColumns={visibleColumns}
            setVisibleColumns={setvisibleColumns}
            onSearch={(e: string) => onSearch(e)}
          >
            <TeamInvite
              // isReadOnly={isView}
              onOpenChange={onOpenChange}
              // isEdit={isEdit}
              isOpen={isOpen}
            />
          </DataTableHeader>
        }
        bottomContent={
          <DataTableFooter
            page={page}
            pages={Math.ceil(totalRows / 10)}
            onPageChange={onPageChange}
            setPage={setPage}
          />
        }
      />
    </>
  )
}