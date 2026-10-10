import type { ReactNode } from "react";
import { Empty } from "antd";

type EmptyStateProps = {
  description?: string;
  action?: ReactNode;
};

export function EmptyState({
  description = "No data",
  action,
}: EmptyStateProps) {
  return <Empty description={description}>{action}</Empty>;
}
