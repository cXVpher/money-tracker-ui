"use client";

import { useMemo, useState } from "react";
import { Tags } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import {
  APP_ICON_OPTIONS,
  AppIcon,
} from "@/shared/_components/icons/app-icon";
import { Button } from "@/shared/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/_components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/_components/ui/dialog";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import type {
  CategoryConfig,
  CategoryGroup,
} from "@/features/settings/_types/settings";

type CategoryEditorState = {
  group: CategoryGroup;
  index: number | null;
  values: CategoryConfig;
};

const emptyCategoryDraft: CategoryConfig = {
  color: "#22c55e",
  icon: "other",
  name: "",
};

type CategorySettings = {
  expense: CategoryConfig[];
  income: CategoryConfig[];
};

const emptyCategorySettings: CategorySettings = {
  expense: [],
  income: [],
};

export function CategorySettingsCard() {
  const [categorySettings, setCategorySettings] = useState(emptyCategorySettings);
  const [categoryEditor, setCategoryEditor] = useState<CategoryEditorState | null>(
    null
  );

  const categoryRows = useMemo(
    () =>
      (["expense", "income"] as const).flatMap((group) =>
        categorySettings[group].map((category, index) => ({
          category,
          group,
          index,
        }))
      ),
    [categorySettings]
  );

  function openCategoryEditor(
    group: CategoryGroup,
    category?: CategoryConfig,
    index?: number
  ) {
    toast.error("Pengaturan kategori belum tersedia.");
  }

  function handleSaveCategory() {
    toast.error("Pengaturan kategori belum tersedia.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tags className="h-4 w-4" />
          Kategori
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Pengaturan kategori belum tersedia untuk akun ini.
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            onClick={() => openCategoryEditor("expense")}
          >
            Tambah Kategori Pengeluaran
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
            onClick={() => openCategoryEditor("income")}
          >
            Tambah Kategori Pemasukan
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categoryRows.length ? categoryRows.map(({ category, group, index }) => (
            <div
              key={`${group}-${category.name}-${index}`}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <span className="flex items-center gap-2 text-sm">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${category.color}1a`, color: category.color }}
                >
                  <AppIcon name={category.icon} size={16} weight="fill" />
                </span>
                {category.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openCategoryEditor(group, category, index)}
              >
                Edit
              </Button>
            </div>
          )) : (
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
              Belum ada kategori.
            </div>
          )}
        </div>
      </CardContent>

      <Dialog
        open={categoryEditor !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCategoryEditor(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {categoryEditor?.index === null ? "Tambah Kategori" : "Edit Kategori"}
            </DialogTitle>
            <DialogDescription>
              Perubahan kategori disimpan di perangkat ini.
            </DialogDescription>
          </DialogHeader>

          {categoryEditor ? (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Nama kategori</Label>
                <Input
                  id="category-name"
                  value={categoryEditor.values.name}
                  onChange={(event) =>
                    setCategoryEditor((current) =>
                      current
                        ? {
                            ...current,
                            values: {
                              ...current.values,
                              name: event.target.value,
                            },
                          }
                        : current
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-icon">Icon</Label>
                <select
                  id="category-icon"
                  value={categoryEditor.values.icon}
                  onChange={(event) =>
                    setCategoryEditor((current) =>
                      current
                        ? {
                            ...current,
                            values: {
                              ...current.values,
                              icon: event.target.value,
                            },
                          }
                        : current
                    )
                  }
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {APP_ICON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-color">Warna</Label>
                <Input
                  id="category-color"
                  type="color"
                  value={categoryEditor.values.color}
                  onChange={(event) =>
                    setCategoryEditor((current) =>
                      current
                        ? {
                            ...current,
                            values: {
                              ...current.values,
                              color: event.target.value,
                            },
                          }
                        : current
                    )
                  }
                />
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
            <Button onClick={handleSaveCategory}>Simpan Kategori</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

