"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import React from "react";

interface DataTableHeaderProps {
  children: React.ReactNode;
  columnsFilter: { name: string; uid: string; sortable?: boolean }[];
  onNew: any;
  buttonNewLabel?:string,
  // eslint-disable-next-line no-unused-vars
  onSearch: (e: any) => void;
  setVisibleColumns: React.Dispatch<React.SetStateAction<Set<string>>>;
  visibleColumns: Set<string>;
}

export default function DataTableHeader({
  onNew,
  buttonNewLabel,
  columnsFilter,
  visibleColumns,
  setVisibleColumns,
  onSearch,
  children,
}: DataTableHeaderProps) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            size="sm"
            variant="bordered"
            placeholder="Type to search..."
            onValueChange={onSearch}
            startContent={
              <Icon
                icon="lucide:search"
                className=" pointer-events-none  mb-0.5 flex-shrink-0 text-slate-400"
              />
            }
            className="max-w-xs text-slate-950 dark:text-white/90"
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  size="sm"
                  endContent={
                    <Icon icon="lucide:chevron-down" className="text-small" />
                  }
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns as any}
              >
                {columnsFilter.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    <span className="capitalize">{column.name}</span>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              size="sm"
              endContent={<Icon icon="lucide:plus" className="text-small" />}
              color="primary"
              onPress={() => onNew()}
            >
              {buttonNewLabel?buttonNewLabel:"New"}
            </Button>
          </div>
        </div>
        <div></div>
      </div>
      {children}
    </>
  );
}