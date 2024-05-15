import { Button, Pagination } from "@nextui-org/react";
import React, { useState } from "react";

interface DataTableFooterProps {
  pages: number;
  page: number;
  setPage: (num: number) => void;
  onPageChange: (e: number) => void;
}
export default function DataTableFooter({
  pages,
  page,
  setPage,
  onPageChange,
}: DataTableFooterProps) {
  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
      onPageChange(page + 1);
    }
  }, [page, pages]);
  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
      onPageChange(page - 1);
    }
  }, [page]);
  return (
    <>
      <div className="flex items-center justify-between px-2 py-2">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          initialPage={1}
          page={page}
          total={pages}
          onChange={(e) => {
            setPage(e);
            onPageChange(e);
          }}
          isDisabled={pages > 1 ? false : true}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={() => {
              onPreviousPage();
            }}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={() => {
              onNextPage();
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}