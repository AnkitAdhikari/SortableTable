"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input, InputNumber } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { createUserSchema } from "../model/schemas";
import type { CreateUserInput } from "../model/types";

type CreateUserFormProps = {
  formId: string;
  onSubmit: (values: CreateUserInput) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
};

export function CreateUserForm({
  formId,
  onSubmit,
  onDirtyChange,
}: CreateUserFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      age: 0,
      address: "",
    },
  });

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  return (
    <form
      id={formId}
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input id="name" {...field} status={errors.name ? "error" : ""} />
          )}
        />
        {errors.name ? (
          <span className="text-sm text-red-500">{errors.name.message}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="age" className="text-sm font-medium">
          Age
        </label>
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <InputNumber
              id="age"
              min={0}
              precision={0}
              style={{ width: "100%" }}
              status={errors.age ? "error" : ""}
              value={field.value}
              onChange={(value) => field.onChange(value ?? 0)}
            />
          )}
        />
        {errors.age ? (
          <span className="text-sm text-red-500">{errors.age.message}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Input
              id="address"
              {...field}
              status={errors.address ? "error" : ""}
            />
          )}
        />
        {errors.address ? (
          <span className="text-sm text-red-500">{errors.address.message}</span>
        ) : null}
      </div>
    </form>
  );
}
