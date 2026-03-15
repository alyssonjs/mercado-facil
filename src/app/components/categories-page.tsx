import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Tag, Package } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { categories as initialCategories, products as mockProducts } from "../data/mock-data";
import { hasApi, categories as apiCategories, products as apiProducts } from "../lib/api";

interface Category {
  id: string;
  name: string;
  active: boolean;
}

export function CategoriesPage() {
  const [categoriesList, setCategoriesList] = useState<Category[]>(
    initialCategories.map((name, i) => ({
      id: `cat${i}`,
      name,
      active: true,
    }))
  );
  const [productCountByCategory, setProductCountByCategory] = useState<Record<string, number>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    if (!hasApi()) return;
    apiCategories.list().then((cats) => {
      setCategoriesList(
        cats.map((c) => ({
          id: String(c.id),
          name: c.name,
          active: c.active ?? true,
        }))
      );
    }).catch(() => {});
    apiProducts.list().then((prods) => {
      const count: Record<string, number> = {};
      prods.forEach((p) => {
        const name = p.category_name ?? "";
        count[name] = (count[name] ?? 0) + 1;
      });
      setProductCountByCategory(count);
    }).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNew = () => {
    setEditing(null);
    setFormName("");
    setDialogOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setFormName(c.name);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    if (hasApi()) {
      setSaving(true);
      try {
        if (editing) {
          await apiCategories.update(Number(editing.id), { name: formName.trim() });
        } else {
          await apiCategories.create({ name: formName.trim() });
        }
        loadData();
        setDialogOpen(false);
      } catch {
        setSaving(false);
      } finally {
        setSaving(false);
      }
      return;
    }
    if (editing) {
      setCategoriesList((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, name: formName } : c))
      );
    } else {
      setCategoriesList((prev) => [
        ...prev,
        { id: `cat${Date.now()}`, name: formName, active: true },
      ]);
    }
    setDialogOpen(false);
  };

  const toggleActive = async (id: string) => {
    const c = categoriesList.find((x) => x.id === id);
    if (!c) return;
    if (hasApi()) {
      try {
        await apiCategories.update(Number(id), { active: !c.active });
        loadData();
      } catch {}
      return;
    }
    setCategoriesList((prev) =>
      prev.map((x) => (x.id === id ? { ...x, active: !x.active } : x))
    );
  };

  const deleteCategory = async (id: string) => {
    if (hasApi()) {
      try {
        await apiCategories.delete(Number(id));
        loadData();
      } catch {}
      return;
    }
    setCategoriesList((prev) => prev.filter((c) => c.id !== id));
  };

  const getProductCount = (categoryName: string) => {
    if (hasApi() && Object.keys(productCountByCategory).length > 0) {
      return productCountByCategory[categoryName] ?? 0;
    }
    return mockProducts.filter((p) => p.category === categoryName).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Categorias</h1>
          <p className="text-muted-foreground text-[14px] mt-1">
            {categoriesList.length} categorias cadastradas
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categoriesList.map((cat) => {
          const count = getProductCount(cat.name);
          return (
            <Card
              key={cat.id}
              className={`hover:shadow-md transition-shadow ${!cat.active ? "opacity-50" : ""}`}
            >
              <CardContent className="py-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[14px]">{cat.name}</p>
                      <div className="flex items-center gap-1 text-[12px] text-muted-foreground mt-0.5">
                        <Package className="w-3 h-3" />
                        <span>{count} produtos</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`text-[10px] ${
                      cat.active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {cat.active ? "Ativa" : "Inativa"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <Switch
                    checked={cat.active}
                    onCheckedChange={() => toggleActive(cat.id)}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 rounded-md hover:bg-accent text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label>Nome da Categoria</Label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Ex: Frutas"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
