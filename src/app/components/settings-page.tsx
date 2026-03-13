import { useState } from "react";
import {
  Store,
  MapPin,
  Clock,
  DollarSign,
  Save,
  Users,
  Plus,
  Trash2,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

interface StoreUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "atendente" | "entregador";
  active: boolean;
}

const initialUsers: StoreUser[] = [
  { id: "u1", name: "Joao Admin", email: "joao@mercado.com", role: "admin", active: true },
  { id: "u2", name: "Maria Atendente", email: "maria@mercado.com", role: "atendente", active: true },
  { id: "u3", name: "Lucas Ferreira", email: "lucas@mercado.com", role: "entregador", active: true },
  { id: "u4", name: "Rafael Mendes", email: "rafael@mercado.com", role: "entregador", active: true },
];

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  atendente: "Atendente",
  entregador: "Entregador",
};

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  atendente: "bg-blue-100 text-blue-800",
  entregador: "bg-orange-100 text-orange-800",
};

export function SettingsPage() {
  // Store settings
  const [storeName, setStoreName] = useState("Mercearia do Bairro");
  const [storePhone, setStorePhone] = useState("(11) 3456-7890");
  const [storeAddress, setStoreAddress] = useState("Rua Principal, 100 - Centro");
  const [deliveryFee, setDeliveryFee] = useState("5.00");
  const [neighborhoods, setNeighborhoods] = useState("Centro, Jardim America, Vila Nova, Bela Vista");
  const [openHours, setOpenHours] = useState("07:00");
  const [closeHours, setCloseHours] = useState("20:00");

  // Users
  const [users, setUsers] = useState<StoreUser[]>(initialUsers);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [formUserName, setFormUserName] = useState("");
  const [formUserEmail, setFormUserEmail] = useState("");
  const [formUserRole, setFormUserRole] = useState<"admin" | "atendente" | "entregador">("atendente");

  const handleSaveStore = () => {
    toast.success("Configuracoes da loja salvas com sucesso!");
  };

  const addUser = () => {
    if (!formUserName || !formUserEmail) return;
    setUsers((prev) => [
      ...prev,
      {
        id: `u${Date.now()}`,
        name: formUserName,
        email: formUserEmail,
        role: formUserRole,
        active: true,
      },
    ]);
    setUserDialogOpen(false);
    setFormUserName("");
    setFormUserEmail("");
    toast.success("Usuario adicionado!");
  };

  const removeUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("Usuario removido!");
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1>Configuracoes</h1>
        <p className="text-muted-foreground text-[14px] mt-1">
          Gerencie sua loja e equipe
        </p>
      </div>

      <Tabs defaultValue="store">
        <TabsList>
          <TabsTrigger value="store">Loja</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="plans">Plano</TabsTrigger>
        </TabsList>

        {/* Store settings */}
        <TabsContent value="store" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Dados da Loja
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Nome da Loja</Label>
                  <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
                </div>
                <div>
                  <Label>Endereco</Label>
                  <Input value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Taxa de Entrega Padrao (R$)</Label>
                  <Input
                    type="number"
                    step="0.50"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Bairros Atendidos</Label>
                  <Input
                    value={neighborhoods}
                    onChange={(e) => setNeighborhoods(e.target.value)}
                    placeholder="Separados por virgula"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Separe os bairros por virgula
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Horario de Funcionamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Abre</Label>
                    <Input
                      type="time"
                      value={openHours}
                      onChange={(e) => setOpenHours(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Fecha</Label>
                    <Input
                      type="time"
                      value={closeHours}
                      onChange={(e) => setCloseHours(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button onClick={handleSaveStore} className="mt-4 gap-2">
            <Save className="w-4 h-4" />
            Salvar Configuracoes
          </Button>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-[15px] flex items-center gap-2">
                <Users className="w-4 h-4" />
                Equipe ({users.length})
              </CardTitle>
              <Button
                size="sm"
                onClick={() => setUserDialogOpen(true)}
                className="gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/30"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[13px]">
                      {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px]">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground">{u.email}</p>
                    </div>
                    <Badge className={`text-[10px] ${roleColors[u.role]}`}>
                      {roleLabels[u.role]}
                    </Badge>
                    {u.role !== "admin" && (
                      <button
                        onClick={() => removeUser(u.id)}
                        className="p-1.5 rounded-md hover:bg-accent text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans */}
        <TabsContent value="plans" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Basico",
                price: "R$ 49",
                features: ["Painel administrativo", "Produtos e categorias", "Clientes", "Pedidos manuais", "Dashboard simples"],
                current: false,
              },
              {
                name: "Loja Online",
                price: "R$ 79",
                features: [
                  "Tudo do Basico",
                  "Vitrine online da loja",
                  "Carrinho de compras",
                  "Checkout simples",
                  "Pedidos pelo cliente",
                ],
                current: true,
              },
              {
                name: "Completo",
                price: "R$ 119",
                features: [
                  "Tudo acima",
                  "Controle de entregas",
                  "Estoque basico",
                  "Dashboard com metricas",
                  "Bairros com taxas",
                ],
                current: false,
              },
            ].map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.current ? "border-primary border-2" : ""
                }`}
              >
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-[10px]">
                      Seu Plano
                    </Badge>
                  </div>
                )}
                <CardHeader className="items-center text-center">
                  <CardTitle className="text-[15px]">Plano {plan.name}</CardTitle>
                  <div>
                    <span className="text-[28px] text-primary">{plan.price}</span>
                    <span className="text-[13px] text-muted-foreground">/mes</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[13px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-4"
                    variant={plan.current ? "outline" : "default"}
                    disabled={plan.current}
                  >
                    {plan.current ? "Plano Atual" : "Escolher Plano"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add user dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Adicionar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Nome</Label>
              <Input
                value={formUserName}
                onChange={(e) => setFormUserName(e.target.value)}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formUserEmail}
                onChange={(e) => setFormUserEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <Label>Perfil</Label>
              <Select value={formUserRole} onValueChange={(v) => setFormUserRole(v as typeof formUserRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="atendente">Atendente</SelectItem>
                  <SelectItem value="entregador">Entregador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addUser}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}