"use client";

import { useRef } from "react";
import { notifySuccess } from "@/shared/query/notify";
import { confirmAction, DrawerForm } from "@/shared/ui";
import { useCreateUserMutation } from "../client/mutations";
import type { CreateUserInput } from "../model/types";
import { CreateUserForm } from "./CreateUserForm";

const FORM_ID = "create-user-form";

type CreateUserDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateUserDrawer({ open, onClose }: CreateUserDrawerProps) {
  const dirtyRef = useRef(false);
  const createUser = useCreateUserMutation();

  const handleClose = () => {
    if (dirtyRef.current) {
      confirmAction({
        title: "Discard changes?",
        content: "You have unsaved changes. Close anyway?",
        okText: "Discard",
        danger: true,
        onOk: () => {
          dirtyRef.current = false;
          onClose();
        },
      });
      return;
    }
    onClose();
  };

  const handleSubmit = async (values: CreateUserInput) => {
    await createUser.mutateAsync(values);
    dirtyRef.current = false;
    notifySuccess("User added");
    onClose();
  };

  return (
    <DrawerForm
      open={open}
      title="Add user"
      onClose={handleClose}
      onSubmit={() => {
        const form = document.getElementById(FORM_ID) as HTMLFormElement | null;
        form?.requestSubmit();
      }}
      submitLabel="Add user"
      submitting={createUser.isPending}
    >
      {open ? (
        <CreateUserForm
          formId={FORM_ID}
          onSubmit={handleSubmit}
          onDirtyChange={(dirty) => {
            dirtyRef.current = dirty;
          }}
        />
      ) : null}
    </DrawerForm>
  );
}
