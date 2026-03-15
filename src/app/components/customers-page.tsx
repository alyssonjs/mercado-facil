import { useState, useEffect } from "react";
import { Search, Plus, Phone, MapPin, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { customers as initialCustomers, type Customer } from "../data/mock-data";
import { hasApi, customers as apiCustomers } from "../lib/api";

function mapApiCustomerToCustomer(c: {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address_line: string;
  neighborhood: string;
  notes: string | null;
  total_orders: number;
}): Customer {
  return {
    id: String(c.id),
    name: c.name,
    phone: c.phone,
    email: c.email ?? undefined,
    address: c.address_line,
    neighborhood: c.neighborhood,
    notes: c.notes ?? "",
    totalOrders: c.total_orders ?? 0,
    lastOrder: "-",
  };
}

export function CustomersPage() {
  const [customersList, setCustomersList] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formNeighborhood, setFormNeighborhood] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const loadData = () => {
    if (!hasApi()) return;
    apiCustomers.list().then((list) => setCustomersList(list.map(mapApiCustomerToCustomer))).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = customersList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const openNew = () => {
    setEditing(null);
    setFormName("");
    setFormPhone("");
    setFormAddress("");
    setFormNeighborhood("");
    setFormNotes("");
    setDialogOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditing(c);
    setFormName(c.name);
    setFormPhone(c.phone);
    setFormAddress(c.address);
    setFormNeighborhood(c.neighborhood);
    setFormNotes(c.notes);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName || !formPhone) return;
    if (hasApi()) {
      setSaving(true);
      try {
        const payload = {
          name: formName,
          phone: formPhone,
          address_line: formAddress,
          neighborhood: formNeighborhood,
          notes: formNotes || null,
        };
        if (editing) {
          await apiCustomers.update(Number(editing.id), payload);
        } else {
          await apiCustomers.create(payload);
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
    const customer: Customer = {
      id: editing?.id || `c${Date.now()}`,
      name: formName,
      phone: formPhone,
      address: formAddress,
      neighborhood: formNeighborhood,
      notes: formNotes,
      totalOrders: editing?.totalOrders || 0,
      lastOrder: editing?.lastOrder || "-",
    };
    if (editing) {
      setCustomersList((prev) => prev.map((c) => (c.id === editing.id ? customer : c)));
    } else {
      setCustomersList((prev) => [...prev, customer]);
    }
    setDialogOpen(false);
  };

  const deleteCustomer = async (id: string) => {
    if (hasApi()) {
      try {
        await apiCustomers.delete(Number(id));
        loadData();
      } catch {}
      return;
    }
    setCustomersList((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Clientes</h1>
          <p className="text-muted-foreground text-[14px] mt-1">
            {customersList.length} clientes cadastrados
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou telefone..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardContent className="py-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[14px] shrink-0">
                  {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] truncate">{c.name}</p>
                  <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mt-1">
                    <Phone className="w-3 h-3" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{c.address} - {c.neighborhood}</span>
                  </div>
                  {c.notes && (
                    <p className="text-[11px] text-amber-600 mt-1.5 bg-amber-50 px-2 py-0.5 rounded">
                      {c.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-[16px] text-primary">{c.totalOrders}</p>
                    <p className="text-[10px] text-muted-foreground">pedidos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[12px]">{c.lastOrder !== "-" ? new Date(c.lastOrder).toLocaleDateString("pt-BR") : "-"}</p>
                    <p className="text-[10px] text-muted-foreground">ultimo</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteCustomer(c.id)}
                    className="p-1.5 rounded-md hover:bg-accent text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Nome</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nome completo" />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="(11) 99999-9999" />
            </div>
            <div>
              <Label>Endereco</Label>
              <Input value={formAddress} onChange={(e) => setFormAddress(e.target.value)} placeholder="Rua, numero" />
            </div>
            <div>
              <Label>Bairro</Label>
              <Input value={formNeighborhood} onChange={(e) => setFormNeighborhood(e.target.value)} placeholder="Bairro" />
            </div>
            <div>
              <Label>Observacoes</Label>
              <Input value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="Opcional" />
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
