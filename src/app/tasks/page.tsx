import { Suspense } from "react";
import { Spin } from "antd";
import { TasksPage } from "@/modules/tasks";

export default function TasksRoutePage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-neutral-900">
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Spin />
          </div>
        }
      >
        <TasksPage />
      </Suspense>
    </div>
  );
}
