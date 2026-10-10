import { Alert } from "antd";

type ErrorAlertProps = {
  title?: string;
  description?: string;
};

export function ErrorAlert({
  title = "Something went wrong",
  description,
}: ErrorAlertProps) {
  return (
    <Alert type="error" showIcon message={title} description={description} />
  );
}
