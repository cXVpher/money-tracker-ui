"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type TransactionCategory,
} from "@/services/category.service";

type CategoryEditorState = {
  id?: string;
  name: string;
  icon: string;
  color: string;
};

export function CategorySettingsCard() {
  const queryClient = useQueryClient();
  const [categoryEditor, setCategoryEditor] = useState<CategoryEditorState | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const saveCategoryMutation = useMutation({
    mutationFn: async (input: CategoryEditorState) => {
      if (input.id) {
        return updateCategory({
          id: input.id,
          color: input.color,
          icon: input.icon,
          description: input.name,
        });
      } else {
        return createCategory({
          name: input.name.trim(),
          icon: input.icon,
          color: input.color,
        });
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan kategori.");
    },
    onSuccess: () => {
      setCategoryEditor(null);
      toast.success("Kategori berhasil disimpan.");
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus kategori.");
    },
    onSuccess: () => {
      toast.success("Kategori berhasil dihapus.");
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const categories = categoriesQuery.data ?? [];

  function openCreateDialog() {
    setCategoryEditor({
      name: "",
      icon: "other",
      color: "#22c55e",
    });
  }

  function openEditDialog(category: TransactionCategory) {
    setCategoryEditor({
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
  }

  function handleSaveCategory() {
    if (!categoryEditor?.name.trim()) {
      toast.error("Nama kategori wajib diisi.");
      return;
    }

    saveCategoryMutation.mutate(categoryEditor);
  }

  function handleDeleteCategory(category: TransactionCategory) {
    if (!window.confirm(`Hapus kategori "${category.name}"?`)) {
      return;
    }

    deleteCategoryMutation.mutate(category.id);
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
        {categoriesQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat kategori...</p>
        ) : null}

        {categoriesQuery.isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {categoriesQuery.error instanceof Error ? categoriesQuery.error.message : "Gagal memuat kategori."}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openCreateDialog}
          >
            Tambah Kategori Baru
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.length ? categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-lg border border-border p-3 bg-card"
            >
              <span className="flex items-center gap-2 text-sm">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${category.color}1a`, color: category.color }}
                >
                  <AppIcon name={category.icon} size={16} weight="fill" />
                </span>
                <span className="font-medium">{category.name}</span>
                {category.isDefault && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-normal">
                    Sistem
                  </span>
                )}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(category)}
                >
                  Edit
                </Button>
                {!category.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    disabled={deleteCategoryMutation.isPending}
                    onClick={() => handleDeleteCategory(category)}
                  >
                    Hapus
                  </Button>
                )}
              </div>
            </div>
          )) : !categoriesQuery.isLoading ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
              Belum ada kategori.
            </div>
          ) : null}
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
              {categoryEditor?.id ? "Edit Kategori" : "Tambah Kategori"}
            </DialogTitle>
            <DialogDescription>
              Kategori ini dapat digunakan untuk transaksi dan anggaran belanja Anda.
            </DialogDescription>
          </DialogHeader>

          {categoryEditor ? (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Nama kategori</Label>
                <Input
                  id="category-name"
                  value={categoryEditor.name}
                  onChange={(event) =>
                    setCategoryEditor((current) =>
                      current ? { ...current, name: event.target.value } : current
                    )
                  }
                  disabled={categoryEditor.id !== undefined && categories.find(c => c.id === categoryEditor.id)?.isDefault}
                  placeholder="e.g. Makanan Sehat"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-icon">Icon</Label>
                <select
                  id="category-icon"
                  value={categoryEditor.icon}
                  onChange={(event) =>
                    setCategoryEditor((current) =>
                      current ? { ...current, icon: event.target.value } : current
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
                  value={categoryEditor.color}
                  onChange={(event) =>
                    setCategoryEditor((current) =>
                      current ? { ...current, color: event.target.value } : current
                    )
                  }
                />
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
            <Button
              disabled={saveCategoryMutation.isPending}
              onClick={handleSaveCategory}
            >
              {saveCategoryMutation.isPending ? "Menyimpan..." : "Simpan Kategori"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
