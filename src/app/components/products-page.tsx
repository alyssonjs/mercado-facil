import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Package,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  products as initialProducts,
  categories as mockCategories,
  formatCurrency,
  type Product,
} from "../data/mock-data";
import { hasApi, products as apiProducts, categories as apiCategories } from "../lib/api";

function mapApiProductToProduct(p: {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  sale_type: string;
  unit_type: string;
  stock_quantity: number;
  minimum_stock_alert: number;
  active: boolean;
  featured: boolean;
  image_url: string | null;
  category_name: string | null;
}): Product {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    category: p.category_name ?? "",
    price: p.price_cents / 100,
    saleType: (p.sale_type === "weight" ? "weight" : "unit") as "unit" | "weight",
    unitType: p.unit_type ?? "un",
    stock: p.stock_quantity,
    minStock: p.minimum_stock_alert ?? 0,
    active: p.active,
    featured: p.featured,
    description: p.description ?? "",
  };
}

export function ProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [categoriesList, setCategoriesList] = useState<string[]>(mockCategories);
  const [categoriesWithId, setCategoriesWithId] = useState<{ id: number; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    if (!hasApi()) return;
    Promise.all([apiProducts.list(), apiCategories.list()]).then(([prods, cats]) => {
      setProductsList(prods.map(mapApiProductToProduct));
      setCategoriesList(cats.map((c) => c.name));
      setCategoriesWithId(cats.map((c) => ({ id: c.id, name: c.name })));
    }).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formSaleType, setFormSaleType] = useState<"unit" | "weight">("unit");
  const [formUnitType, setFormUnitType] = useState("un");
  const [formStock, setFormStock] = useState("");
  const [formMinStock, setFormMinStock] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const filtered = productsList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const openNew = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory("");
    setFormPrice("");
    setFormSaleType("unit");
    setFormUnitType("un");
    setFormStock("");
    setFormMinStock("");
    setFormDescription("");
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price.toString());
    setFormSaleType(p.saleType);
    setFormUnitType(p.unitType);
    setFormStock(p.stock.toString());
    setFormMinStock(p.minStock.toString());
    setFormDescription(p.description);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName || !formCategory || !formPrice) return;
    const slug = formName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const priceCents = Math.round(parseFloat(formPrice) * 100);
    const stock = parseInt(formStock) || 0;
    const minStock = parseInt(formMinStock) || 5;

    if (hasApi()) {
      setSaving(true);
      try {
        const categoryId = categoriesWithId.find((c) => c.name === formCategory)?.id;
        if (editingProduct) {
          await apiProducts.update(Number(editingProduct.id), {
            name: formName,
            slug,
            category_id: categoryId,
            description: formDescription || null,
            price_cents: priceCents,
            sale_type: formSaleType,
            unit_type: formUnitType,
            stock_quantity: stock,
            minimum_stock_alert: minStock,
          });
        } else {
          await apiProducts.create({
            name: formName,
            slug,
            category_id: categoryId,
            description: formDescription || null,
            price_cents: priceCents,
            sale_type: formSaleType,
            unit_type: formUnitType,
            stock_quantity: stock,
            minimum_stock_alert: minStock,
            active: true,
            featured: false,
          });
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

    const newProduct: Product = {
      id: editingProduct?.id || `p${Date.now()}`,
      name: formName,
      slug,
      category: formCategory,
      price: parseFloat(formPrice),
      saleType: formSaleType,
      unitType: formUnitType,
      stock,
      minStock,
      active: editingProduct?.active ?? true,
      featured: editingProduct?.featured ?? false,
      description: formDescription,
    };
    if (editingProduct) {
      setProductsList((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? newProduct : p))
      );
    } else {
      setProductsList((prev) => [...prev, newProduct]);
    }
    setDialogOpen(false);
  };

  const toggleActive = async (id: string) => {
    const p = productsList.find((x) => x.id === id);
    if (!p) return;
    if (hasApi()) {
      try {
        await apiProducts.update(Number(id), { active: !p.active });
        loadData();
      } catch {}
      return;
    }
    setProductsList((prev) =>
      prev.map((x) => (x.id === id ? { ...x, active: !x.active } : x))
    );
  };

  const deleteProduct = async (id: string) => {
    if (hasApi()) {
      try {
        await apiProducts.delete(Number(id));
        loadData();
      } catch {}
      return;
    }
    setProductsList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Produtos</h1>
          <p className="text-muted-foreground text-[14px] mt-1">
            {productsList.length} produtos cadastrados
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Produto
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produto..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                {categoriesList.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Preco</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className={!p.active ? "opacity-50" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                          <Package className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[13px]">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {p.saleType === "weight" ? "Por peso" : "Por unidade"} ({p.unitType})
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px]">{p.category}</TableCell>
                    <TableCell className="text-right text-[13px]">
                      {formatCurrency(p.price)}/{p.unitType}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`text-[13px] ${
                          p.stock <= p.minStock
                            ? p.stock <= 3
                              ? "text-destructive"
                              : "text-amber-600"
                            : ""
                        }`}
                      >
                        {p.stock} {p.unitType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          p.active
                            ? "bg-green-100 text-green-800 text-[10px]"
                            : "bg-gray-100 text-gray-600 text-[10px]"
                        }
                      >
                        {p.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleActive(p.id)}
                          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"
                        >
                          {p.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 rounded-md hover:bg-accent text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Nome</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ex: Banana Prata" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Categoria</Label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Preco (R$)</Label>
                <Input type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tipo de Venda</Label>
                <Select value={formSaleType} onValueChange={(v) => setFormSaleType(v as "unit" | "weight")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unit">Unidade</SelectItem>
                    <SelectItem value="weight">Peso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Unidade</Label>
                <Select value={formUnitType} onValueChange={setFormUnitType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un">un</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="cx">cx</SelectItem>
                    <SelectItem value="maco">maco</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Estoque</Label>
                <Input type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} placeholder="0" />
              </div>
              <div>
                <Label>Estoque Minimo</Label>
                <Input type="number" value={formMinStock} onChange={(e) => setFormMinStock(e.target.value)} placeholder="5" />
              </div>
            </div>
            <div>
              <Label>Descricao</Label>
              <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Descricao curta do produto" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}