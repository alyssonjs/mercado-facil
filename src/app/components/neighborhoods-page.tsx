import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  neighborhoods as initialNeighborhoods,
  formatCurrency,
  type Neighborhood,
} from "../data/mock-data";
import { hasApi, neighborhoods as apiNeighborhoods } from "../lib/api";

export function NeighborhoodsPage() {
  const [list, setList] = useState<Neighborhood[]>(initialNeighborhoods);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Neighborhood | null>(null);
  const [formName, setFormName] = useState("");
  const [formFee, setFormFee] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    if (!hasApi()) return;
    apiNeighborhoods.list().then((data) => {
      setList(data.map((n) => ({
        id: String(n.id),
        name: n.name,
        deliveryFee: n.delivery_fee_cents / 100,
        active: n.active ?? true,
      })));
    }).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNew = () => {
    setEditing(null);
    setFormName("");
    setFormFee("");
    setDialogOpen(true);
  };

  const openEdit = (n: Neighborhood) => {
    setEditing(n);
    setFormName(n.name);
    setFormFee(n.deliveryFee.toString());
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName || !formFee) return;
    const feeCents = Math.round(parseFloat(formFee) * 100);
    if (hasApi()) {
      setSaving(true);
      try {
        if (editing) {
          await apiNeighborhoods.update(Number(editing.id), { name: formName, delivery_fee_cents: feeCents });
        } else {
          await apiNeighborhoods.create({ name: formName, delivery_fee_cents: feeCents });
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
    const item: Neighborhood = {
      id: editing?.id || `n${Date.now()}`,
      name: formName,
      deliveryFee: parseFloat(formFee),
      active: editing?.active ?? true,
    };
    if (editing) {
      setList((prev) => prev.map((n) => (n.id === editing.id ? item : n)));
    } else {
      setList((prev) => [...prev, item]);
    }
    setDialogOpen(false);
  };

  const toggleActive = async (id: string) => {
    const n = list.find((x) => x.id === id);
    if (!n) return;
    if (hasApi()) {
      try {
        await apiNeighborhoods.update(Number(id), { active: !n.active });
        loadData();
      } catch {}
      return;
    }
    setList((prev) =>
      prev.map((x) => (x.id === id ? { ...x, active: !x.active } : x))
    );
  };

  const deleteNeighborhood = async (id: string) => {
    if (hasApi()) {
      try {
        await apiNeighborhoods.delete(Number(id));
        loadData();
      } catch {}
      return;
    }
    setList((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Bairros e Taxas</h1>
          <p className="text-muted-foreground text-[14px] mt-1">
            Configure os bairros atendidos e suas taxas de entrega
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Bairro
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bairro</TableHead>
                  <TableHead className="text-right">Taxa de Entrega</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((n) => (
                  <TableRow key={n.id} className={!n.active ? "opacity-50" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-[13px]">{n.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[13px]">
                      {formatCurrency(n.deliveryFee)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={n.active}
                          onCheckedChange={() => toggleActive(n.id)}
                        />
                        <Badge
                          className={`text-[10px] ${
                            n.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {n.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(n)}
                          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteNeighborhood(n.id)}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar Bairro" : "Novo Bairro"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Nome do Bairro</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Centro"
              />
            </div>
            <div>
              <Label>Taxa de Entrega (R$)</Label>
              <Input
                type="number"
                step="0.50"
                value={formFee}
                onChange={(e) => setFormFee(e.target.value)}
                placeholder="5.00"
              />
            </div>
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
