"use client";

import { Button, Table, type TableColumnsType, type TableProps } from "antd";
import type { ListUsersMeta, User } from "../model/types";

type UsersTableProps = {
  rows: User[];
  meta: ListUsersMeta;
  loading?: boolean;
  /** From shared Zustand shell store — session preference, not URL. */
  size?: "large" | "middle" | "small";
  onPageChange: (page: number, pageSize: number) => void;
  onSortChange: (
    sort: ListUsersMeta["sort"],
    sortDir: ListUsersMeta["sortDir"],
  ) => void;
  onOpenUser: (id: number) => void;
};

export function UsersTable({
  rows,
  meta,
  loading,
  size = "middle",
  onPageChange,
  onSortChange,
  onOpenUser,
}: UsersTableProps) {
  const columns: TableColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      sortOrder:
        meta.sort === "name"
          ? meta.sortDir === "asc"
            ? "ascend"
            : "descend"
          : undefined,
    },
    {
      title: "Age",
      dataIndex: "age",
      sorter: true,
      sortOrder:
        meta.sort === "age"
          ? meta.sortDir === "asc"
            ? "ascend"
            : "descend"
          : undefined,
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button type="link" onClick={() => onOpenUser(record.id)}>
          View
        </Button>
      ),
    },
  ];

  const handleChange: TableProps<User>["onChange"] = (
    pagination,
    _filters,
    sorter,
  ) => {
    const nextPage = pagination.current ?? meta.page;
    const nextPageSize = pagination.pageSize ?? meta.pageSize;

    if (nextPage !== meta.page || nextPageSize !== meta.pageSize) {
      onPageChange(nextPage, nextPageSize);
    }

    const single = Array.isArray(sorter) ? sorter[0] : sorter;
    if (single?.field && single.order) {
      const field = String(single.field);
      if (field === "name" || field === "age" || field === "id") {
        onSortChange(field, single.order === "ascend" ? "asc" : "desc");
      }
    }
  };

  return (
    <Table<User>
      rowKey="id"
      size={size}
      columns={columns}
      dataSource={rows}
      loading={loading}
      onChange={handleChange}
      pagination={{
        current: meta.page,
        pageSize: meta.pageSize,
        total: meta.total,
        showSizeChanger: true,
      }}
    />
  );
}
