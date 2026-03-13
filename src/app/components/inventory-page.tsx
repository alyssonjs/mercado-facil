import { useState } from "react";
import {
  Package,
  AlertTriangle,
  ArrowUpCircle,
  ArrowDownCircle,
  Search,
  Plus,
  History,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  products as initialProducts,
  stockMovements as initialMovements,
  formatDateTime,
  type Product,
  type StockMovement,
} from "../data/mock-data";

export function InventoryPage() {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [movements, setMovements] = useState<StockMovement[]>(initialMovements);
  const [search, setSearch] = useState("");
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [adjustType, setAdjustType] = useState<"entrada" | "saida" | "ajuste">("entrada");
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "zero">("all");

  const filtered = productsList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "low") return matchSearch && p.stock > 0 && p.stock <= p.minStock;
    if (filter === "zero") return matchSearch && p.stock === 0;
    return matchSearch;
  });

  const lowStockCount = productsList.filter(
    (p) => p.stock > 0 && p.stock <= p.minStock
  ).length;
  const zeroStockCount = productsList.filter((p) => p.stock === 0).length;

  const handleAdjust = () => {
    if (!selectedProduct || !adjustQty) return;
    const product = productsList.find((p) => p.id === selectedProduct);
    if (!product) return;
    const qty = parseFloat(adjustQty);

    // Update product stock
    setProductsList((prev) =>
      prev.map((p) => {
        if (p.id !== selectedProduct) return p;
        const newStock =
          adjustType === "entrada"
            ? p.stock + qty
            : adjustType === "saida"
            ? Math.max(0, p.stock - qty)
            : p.stock + qty; // ajuste can be negative
        return { ...p, stock: newStock };
      })
    );

    // Add movement
    const newMovement: StockMovement = {
      id: `sm${Date.now()}`,
      productId: product.id,
      productName: product.name,
      type: adjustType,
      quantity: adjustType === "saida" ? -qty : qty,
      reason: adjustReason || "Ajuste manual",
      date: new Date().toISOString(),
    };
    setMovements((prev) => [newMovement, ...prev]);

    setAdjustOpen(false);
    setSelectedProduct("");
    setAdjustQty("");
    setAdjustReason("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Estoque</h1>
          <p className="text-muted-foreground text-[14px] mt-1">
            Controle de estoque e movimentacoes
          </p>
        </div>
        <Button onClick={() => setAdjustOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Ajuste Manual
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="gap-3 py-4">
          <CardContent className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[20px]">{productsList.length}</p>
              <p className="text-[12px] text-muted-foreground">Total Produtos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-3 py-4">
          <CardContent className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-[20px] text-amber-600">{lowStockCount}</p>
              <p className="text-[12px] text-muted-foreground">Estoque Baixo</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-3 py-4">
          <CardContent className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
              <Package className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <p className="text-[20px] text-destructive">{zeroStockCount}</p>
              <p className="text-[12px] text-muted-foreground">Sem Estoque</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Estoque Atual</TabsTrigger>
          <TabsTrigger value="movements">Movimentacoes</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="mt-4">
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
                <div className="flex gap-2">
                  {(["all", "low", "zero"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors ${
                        filter === f
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border"
                      }`}
                    >
                      {f === "all" ? "Todos" : f === "low" ? "Baixo" : "Zerado"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Estoque</TableHead>
                      <TableHead className="text-right">Minimo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p) => {
                      const isLow = p.stock > 0 && p.stock <= p.minStock;
                      const isZero = p.stock === 0;
                      return (
                        <TableRow key={p.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {(isLow || isZero) && (
                                <AlertTriangle
                                  className={`w-3.5 h-3.5 ${
                                    isZero ? "text-destructive" : "text-amber-500"
                                  }`}
                                />
                              )}
                              <span className="text-[13px]">{p.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[13px] text-muted-foreground">
                            {p.category}
                          </TableCell>
                          <TableCell className="text-right text-[13px]">
                            <span
                              className={
                                isZero
                                  ? "text-destructive"
                                  : isLow
                                  ? "text-amber-600"
                                  : ""
                              }
                            >
                              {p.stock} {p.unitType}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-[13px] text-muted-foreground">
                            {p.minStock} {p.unitType}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`text-[10px] ${
                                isZero
                                  ? "bg-red-100 text-red-800"
                                  : isLow
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {isZero ? "Sem estoque" : isLow ? "Baixo" : "OK"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead>Motivo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="text-[12px] text-muted-foreground">
                          {formatDateTime(m.date)}
                        </TableCell>
                        <TableCell className="text-[13px]">{m.productName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {m.type === "entrada" ? (
                              <ArrowUpCircle className="w-3.5 h-3.5 text-green-600" />
                            ) : m.type === "saida" ? (
                              <ArrowDownCircle className="w-3.5 h-3.5 text-red-600" />
                            ) : (
                              <History className="w-3.5 h-3.5 text-blue-600" />
                            )}
                            <Badge
                              className={`text-[10px] ${
                                m.type === "entrada"
                                  ? "bg-green-100 text-green-800"
                                  : m.type === "saida"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {m.type === "entrada"
                                ? "Entrada"
                                : m.type === "saida"
                                ? "Saida"
                                : "Ajuste"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-[13px]">
                          <span
                            className={
                              m.quantity > 0 ? "text-green-600" : "text-red-600"
                            }
                          >
                            {m.quantity > 0 ? "+" : ""}
                            {m.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-[12px] text-muted-foreground">
                          {m.reason}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Adjust dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ajuste de Estoque</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Produto</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {productsList.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} (atual: {p.stock} {p.unitType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo</Label>
              <Select
                value={adjustType}
                onValueChange={(v) => setAdjustType(v as "entrada" | "saida" | "ajuste")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saida</SelectItem>
                  <SelectItem value="ajuste">Ajuste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantidade</Label>
              <Input
                type="number"
                step="0.1"
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Motivo</Label>
              <Input
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="Ex: Compra fornecedor"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdjust}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
