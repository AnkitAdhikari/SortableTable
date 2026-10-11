"use client";

import { Button, Drawer, Space } from "antd";
import type { ReactNode } from "react";

type DrawerFormProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  submitting?: boolean;
  size?: "large" | "middle" | "small";
  children: ReactNode;
  footerExtra?: ReactNode;
};

export function DrawerForm({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel = "Save",
  submitting = false,
  size = "large",
  children,
  footerExtra,
}: DrawerFormProps) {
  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      size={size}
      destroyOnHidden
      footer={
        <div className="flex justify-end">
          <Space>
            {footerExtra}
            <Button onClick={onClose}>Cancel</Button>
            {onSubmit ? (
              <Button type="primary" loading={submitting} onClick={onSubmit}>
                {submitLabel}
              </Button>
            ) : null}
          </Space>
        </div>
      }
    >
      {children}
    </Drawer>
  );
}
