"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Category } from "@prisma/client";
import cn from "classnames";
import { type FC } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { createProduct } from "@/app/actions";
import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";

import { Plus } from "../../../../../public/icon";
import {
  TCreateProductCardSchema,
  createProductCardSchema,
} from "../../schemas/createProductCardSchema";

import s from "./ProductCardCreate.module.scss";

interface Props {
  categories: Omit<Category, "createdAt" | "updatedAt">[];
}

export const ProductCardCreate: FC<Props> = ({ categories }) => {
  const form = useForm<TCreateProductCardSchema>({
    resolver: zodResolver(createProductCardSchema),
    defaultValues: {
      category: "",
      imageUrl: "",
      name: "",
      description: "",
      tags: "",
      price: "",
    },
  });

  const onSubmit = async (data: TCreateProductCardSchema) => {
    try {
      await createProduct(data);

      toast.success("Товар успешно добавлен", {
        icon: "\u2705",
      });

      form.reset();
    } catch (err) {
      console.error("[CREATE_PRODUCT_ERROR]", err);
      toast.error(
        err instanceof Error ? err.message : "Не удалось создать товар",
        { icon: "\u274C" },
      );
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  return (
    <FormProvider {...form}>
      <h2 className={s.title}>Добавить товар</h2>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(s.root, isSubmitting && s.disable)}
        noValidate
      >
        <Controller
          name="category"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormControl
              fullWidth
              error={!!fieldState.error}
              disabled={isSubmitting}
              required
            >
              <InputLabel id="category-label" required>
                Категория
              </InputLabel>
              <Select
                {...field}
                labelId="category-label"
                label="Категория"
                aria-describedby="category-helper"
                required
              >
                {categories.map(({ id, name, slug }) => (
                  <MenuItem key={id} value={name + "," + slug}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              {fieldState.error && (
                <FormHelperText id="category-helper">
                  {fieldState.error.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        <FormInput
          name="imageUrl"
          label="URL изображения"
          type="url"
          placeholder="https://example.com/image.jpg"
          disabled={isSubmitting}
        />

        <FormInput
          name="name"
          label="Заголовок"
          required
          disabled={isSubmitting}
        />

        <FormInput
          name="description"
          label="Описание"
          multiline
          rows={3}
          disabled={isSubmitting}
        />

        <FormInput
          name="tags"
          label="Теги"
          placeholder="тег1, тег2, тег3"
          helperText="Разделяйте теги запятыми"
          disabled={isSubmitting}
        />

        <FormInput
          name="price"
          label="Цена"
          type="number"
          required
          disabled={isSubmitting}
        />

        <Button
          loading={isSubmitting}
          className={s.submitBtn}
          type="submit"
          disabled={isSubmitting}
        >
          <Plus className={s.icon} />
          {isSubmitting ? "Добавляется..." : "Добавить товар"}
        </Button>
      </form>
    </FormProvider>
  );
};
