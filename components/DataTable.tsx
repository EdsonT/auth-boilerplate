"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  DropdownItem,
  Chip,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
} from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};
interface DataTableProps {
  // eslint-disable-next-line no-unused-vars
  actionDelete?: (e: any) => void;
  // eslint-disable-next-line no-unused-vars
  actionEdit?: (e: any) => void;
  // eslint-disable-next-line no-unused-vars
  actionView?: (e: any) => void;
  bottomContent?: React.ReactNode;
  headerColumns: { uid: string; name: string; sortable?: boolean }[];
  items: any[];
  topContent: React.ReactNode;
}

export default function DataTable({
  actionDelete,
  actionEdit,
  actionView,
  bottomContent,
  headerColumns,
  items,
  topContent,
}: DataTableProps) {
  const renderCell = React.useCallback((data: any, columnKey: string) => {
    const cellValue = data[columnKey as keyof typeof data];
    let dateValue;
    let formattedDate;
    
    switch (columnKey) {
      case "state":
        return (
          <Chip
            className="capitalize"
            color={
              statusColorMap[data.state as keyof typeof statusColorMap] as any
            }
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "dateDelivered":
        dateValue = new Date(cellValue);
        formattedDate = `${(dateValue.getMonth() + 1).toString().padStart(2, "0")}/${dateValue.getDate().toString().padStart(2, "0")}/${dateValue.getFullYear()}`;
        return <div>{formattedDate}</div>;
      case "actions":
        return (
          <div className="items-center">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Icon
                    icon="lucide:more-vertical"
                    className="text-default-300"
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {actionView != undefined && typeof actionView === "function" ? (
                  <DropdownItem
                    onClick={() => {
                      try {
                        actionView(data);
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  >
                    View
                  </DropdownItem>
                ) : (
                  <></>
                )}
                {actionEdit != undefined && typeof actionEdit === "function" ? (
                  <DropdownItem
                    onClick={() => {
                      try {
                        actionEdit(data);
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  >
                    Edit
                  </DropdownItem>
                ) : (
                  <></>
                )}
                {actionDelete != undefined &&
                typeof actionDelete === "function" ? (
                  <DropdownItem
                    onClick={() => {
                      try {
                        actionDelete(data);
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  >
                    Delete
                  </DropdownItem>
                ) : (
                  <></>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "price":
        return <> {cellValue}$</>;
      case "area":
        return <> {cellValue} MT2</>;
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      {/* {items?.map((item:any)=>(
        <div key={item.id}>{item.name}</div>
      ))} */}
      <Table topContent={topContent} bottomContent={bottomContent}>
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent={"No rows to display."}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as any)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}