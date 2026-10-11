"use client";

import { Descriptions, Spin } from "antd";
import { DrawerForm, ErrorAlert } from "@/shared/ui";
import { useUserQuery } from "../client/queries";

type UserDetailDrawerProps = {
  userId: number | null;
  onClose: () => void;
};

export function UserDetailDrawer({ userId, onClose }: UserDetailDrawerProps) {
  const open = userId !== null;
  const { data: user, isPending, isError, error } = useUserQuery(userId);

  return (
    <DrawerForm open={open} title="User details" onClose={onClose} size="large">
      {isPending ? (
        <div className="flex justify-center py-12">
          <Spin />
        </div>
      ) : null}
      {isError ? (
        <ErrorAlert
          title="Could not load user"
          description={error instanceof Error ? error.message : undefined}
        />
      ) : null}
      {user ? (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Age">{user.age}</Descriptions.Item>
          <Descriptions.Item label="Address">{user.address}</Descriptions.Item>
        </Descriptions>
      ) : null}
    </DrawerForm>
  );
}
