import { Modal } from "antd";

type ConfirmActionOptions = {
  title: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
  onOk: () => void | Promise<void>;
};

export function confirmAction({
  title,
  content,
  okText = "OK",
  cancelText = "Cancel",
  danger = false,
  onOk,
}: ConfirmActionOptions) {
  Modal.confirm({
    title,
    content,
    okText,
    cancelText,
    okButtonProps: danger ? { danger: true } : undefined,
    onOk,
  });
}
