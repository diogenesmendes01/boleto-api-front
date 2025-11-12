import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Edit, Trash2, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

interface EditFormData {
  customerName: string;
  customerEmail: string;
  customerDocument: string;
  value: number;
  dueDate: string;
}

export default function Boletos() {
  const [, setLocation] = useLocation();
  const { data: boletos, isLoading, refetch } = trpc.boleto.list.useQuery();
  const utils = trpc.useUtils();
  
  const updateMutation = trpc.boleto.update.useMutation();
  const deleteMutation = trpc.boleto.delete.useMutation();
  const cancelMutation = trpc.boleto.cancel.useMutation();

  const [editingBoleto, setEditingBoleto] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    customerName: '',
    customerEmail: '',
    customerDocument: '',
    value: 0,
    dueDate: '',
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<number | null>(null);

  const handleEdit = (boleto: any) => {
    setEditingBoleto(boleto.id);
    setEditFormData({
      customerName: boleto.customerName,
      customerEmail: boleto.customerEmail || '',
      customerDocument: boleto.customerDocument || '',
      value: boleto.value / 100, // Converte centavos para reais
      dueDate: new Date(boleto.dueDate).toISOString().split('T')[0],
    });
  };

  const handleSaveEdit = async () => {
    if (!editingBoleto) return;

    try {
      await updateMutation.mutateAsync({
        id: editingBoleto,
        customerName: editFormData.customerName,
        customerEmail: editFormData.customerEmail || undefined,
        customerDocument: editFormData.customerDocument || undefined,
        value: Math.round(editFormData.value * 100), // Converte reais para centavos
        dueDate: new Date(editFormData.dueDate),
      });

      utils.boleto.list.invalidate();
      toast.success('Boleto atualizado com sucesso');
      setEditingBoleto(null);
    } catch (error) {
      toast.error('Erro ao atualizar boleto');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      utils.boleto.list.invalidate();
      toast.success('Boleto excluído com sucesso');
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error('Erro ao excluir boleto');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelMutation.mutateAsync({ id });
      utils.boleto.list.invalidate();
      toast.success('Boleto cancelado com sucesso');
      setCancelConfirmId(null);
    } catch (error) {
      toast.error('Erro ao cancelar boleto');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' },
      paid: { label: 'Pago', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
      cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' },
      overdue: { label: 'Vencido', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100' },
    };

    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Boletos</h1>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Boletos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todos os boletos gerados pelas suas integrações
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Boletos</CardTitle>
            <CardDescription>
              {boletos?.length || 0} boleto(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {boletos && boletos.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nosso Número</TableHead>
                      <TableHead>API</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Criação</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {boletos.map((boleto) => (
                      <TableRow 
                        key={boleto.id}
                        className="cursor-pointer hover:bg-muted"
                        onClick={(e) => {
                          // Não navegar se clicou em um botão de ação
                          if ((e.target as HTMLElement).closest('button')) return;
                          setLocation(`/boleto/${boleto.id}`);
                        }}
                      >
                        <TableCell className="font-medium">{boleto.nossoNumero}</TableCell>
                        <TableCell>
                          <span className="uppercase text-xs font-semibold">
                            {boleto.apiProvider}
                          </span>
                        </TableCell>
                        <TableCell>{boleto.customerName}</TableCell>
                        <TableCell>{formatCurrency(boleto.value)}</TableCell>
                        <TableCell>{formatDate(boleto.createdAt)}</TableCell>
                        <TableCell>{formatDate(boleto.dueDate)}</TableCell>
                        <TableCell>{getStatusBadge(boleto.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(boleto)}
                              disabled={boleto.status === 'cancelled'}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setCancelConfirmId(boleto.id)}
                              disabled={boleto.status === 'cancelled'}
                              title="Cancelar"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteConfirmId(boleto.id)}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhum boleto encontrado
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Edição */}
      <Dialog open={editingBoleto !== null} onOpenChange={(open) => !open && setEditingBoleto(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Boleto</DialogTitle>
            <DialogDescription>
              Atualize as informações do boleto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nome do Cliente</Label>
              <Input
                id="customerName"
                value={editFormData.customerName}
                onChange={(e) => setEditFormData({ ...editFormData, customerName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={editFormData.customerEmail}
                onChange={(e) => setEditFormData({ ...editFormData, customerEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerDocument">CPF/CNPJ</Label>
              <Input
                id="customerDocument"
                value={editFormData.customerDocument}
                onChange={(e) => setEditFormData({ ...editFormData, customerDocument: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={editFormData.value}
                onChange={(e) => setEditFormData({ ...editFormData, value: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                value={editFormData.dueDate}
                onChange={(e) => setEditFormData({ ...editFormData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBoleto(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este boleto? Esta ação também cancelará o boleto na API e não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Cancelamento */}
      <Dialog open={cancelConfirmId !== null} onOpenChange={(open) => !open && setCancelConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cancelamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este boleto? O boleto será cancelado na API e não poderá mais ser pago.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelConfirmId(null)}>
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelConfirmId && handleCancel(cancelConfirmId)}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar Boleto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
