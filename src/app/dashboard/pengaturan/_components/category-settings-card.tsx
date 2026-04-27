"use client";

import { useMemo, useState } from "react";
import { Tags } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
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
import type { CategoryConfig, CategoryGroup } from "@/features/settings/_types/settings";
import {
  getCategorySettings,
  saveCategorySettings,
  type CategorySettings,
} from "@/shared/_utils/mock-client-store";

type CategoryEditorState = {
  group: CategoryGroup;
  index: number | null;
  values: CategoryConfig;
};

const emptyCategoryDraft: CategoryConfig = {
  color: "#22c55e",
  icon: "🧾",
  name: "",
};

export function CategorySettingsCard() {
  const [categorySettings, setCategorySettings] = useState(getCategorySettings);
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
    setCategoryEditor({
      group,
      index: index ?? null,
      values: category ? { ...category } : { ...emptyCategoryDraft },
    });
  }

  function handleSaveCategory() {
    if (!categoryEditor) {
      return;
    }

    if (!categoryEditor.values.name.trim()) {
      toast.error("Nama kategori wajib diisi.");
      return;
    }

    const nextCategorySettings: CategorySettings = {
      expense: [...categorySettings.expense],
      income: [...categorySettings.income],
    };

    if (categoryEditor.index === null) {
      nextCategorySettings[categoryEditor.group].push(categoryEditor.values);
    } else {
      nextCategorySettings[categoryEditor.group][categoryEditor.index] =
        categoryEditor.values;
    }

    setCategorySettings(nextCategorySettings);
    saveCategorySettings(nextCategorySettings);
    setCategoryEditor(null);
    toast.success("Kategori tersimpan di perangkat ini.");
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
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openCategoryEditor("expense")}
          >
            Tambah Kategori Pengeluaran
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openCategoryEditor("income")}
          >
            Tambah Kategori Pemasukan
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categoryRows.map(({ category, group, index }) => (
            <div
              key={`${group}-${category.name}-${index}`}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <span className="text-sm">
                {category.icon} {category.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openCategoryEditor(group, category, index)}
              >
                Edit
              </Button>
            </div>
          ))}
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
              Perubahan kategori disimpan lokal sampai API kategori siap.
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
                <Input
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
                />
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
