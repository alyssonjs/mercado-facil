import { useState } from "react";
import { Truck, MapPin, Clock, CheckCircle2, User, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  deliveries as initialDeliveries,
  formatDateTime,
  formatTime,
  deliveryStatusLabels,
  deliveryStatusColors,
  type Delivery,
  type DeliveryStatus,
} from "../data/mock-data";

const deliveryPersons = ["Lucas Ferreira", "Rafael Mendes", "Marcos Silva"];

export function DeliveriesPage() {
  const [deliveriesList, setDeliveriesList] = useState<Delivery[]>(initialDeliveries);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = deliveriesList.filter(
    (d) => statusFilter === "all" || d.status === statusFilter
  );

  const updateStatus = (id: string, newStatus: DeliveryStatus) => {
    setDeliveriesList((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return {
          ...d,
          status: newStatus,
          deliveredAt: newStatus === "entregue" ? new Date().toISOString() : d.deliveredAt,
        };
      })
    );
  };

  const statusCounts = {
    atribuida: deliveriesList.filter((d) => d.status === "atribuida").length,
    saiu_entrega: deliveriesList.filter((d) => d.status === "saiu_entrega").length,
    entregue: deliveriesList.filter((d) => d.status === "entregue").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Entregas</h1>
        <p className="text-muted-foreground text-[14px] mt-1">
          Gerencie as entregas do dia
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="gap-3 py-4">
          <CardContent className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[20px]">{statusCounts.atribuida}</p>
              <p className="text-[12px] text-muted-foreground">Aguardando</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-3 py-4">
          <CardContent className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
              <Truck className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-[20px]">{statusCounts.saiu_entrega}</p>
              <p className="text-[12px] text-muted-foreground">Em Rota</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-3 py-4">
          <CardContent className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-[20px]">{statusCounts.entregue}</p>
              <p className="text-[12px] text-muted-foreground">Entregues</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {(["all", "atribuida", "saiu_entrega", "entregue", "cancelada"] as (DeliveryStatus | "all")[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors ${
              statusFilter === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/30"
            }`}
          >
            {s === "all" ? "Todas" : deliveryStatusLabels[s]}
          </button>
        ))}
      </div>

      {/* Deliveries list */}
      <div className="space-y-3">
        {filtered.map((d) => (
          <Card key={d.id}>
            <CardContent className="py-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px]">{d.orderId}</span>
                    <Badge className={`text-[10px] ${deliveryStatusColors[d.status]}`}>
                      {deliveryStatusLabels[d.status]}
                    </Badge>
                  </div>
                  <p className="text-[13px] mt-1">{d.customerName}</p>
                  <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{d.address} - {d.neighborhood}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mt-0.5">
                    <User className="w-3 h-3" />
                    <span>{d.deliveryPerson}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>Atribuido: {formatTime(d.assignedAt)}</span>
                    {d.deliveredAt && (
                      <span className="ml-2 text-green-600">
                        Entregue: {formatTime(d.deliveredAt)}
                      </span>
                    )}
                  </div>
                  {d.notes && (
                    <p className="text-[11px] text-amber-600 mt-1">{d.notes}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  {d.status === "atribuida" && (
                    <Button size="sm" onClick={() => updateStatus(d.id, "saiu_entrega")}>
                      Saiu p/ Entrega
                    </Button>
                  )}
                  {d.status === "saiu_entrega" && (
                    <Button size="sm" onClick={() => updateStatus(d.id, "entregue")}>
                      Marcar Entregue
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-[14px]">
            Nenhuma entrega encontrada
          </div>
        )}
      </div>
    </div>
  );
}
