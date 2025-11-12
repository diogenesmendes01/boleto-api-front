import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Download, Upload as UploadIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UploadResult {
  success: boolean;
  result: {
    processedRows?: number;
    errors?: string[];
  };
}

export default function Upload() {
  const { data: configs } = trpc.apiConfig.list.useQuery();
  const createUploadMutation = trpc.upload.create.useMutation();
  const utils = trpc.useUtils();

  const [selectedApi, setSelectedApi] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const activeApis = configs?.filter(c => c.isActive === 1) || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadExample = () => {
    // Cria um CSV de exemplo
    const csvContent = `nome,email,valor,vencimento\nJoão Silva,joao@example.com,150.00,2025-12-31\nMaria Santos,maria@example.com,200.00,2025-12-31\nPedro Oliveira,pedro@example.com,100.00,2025-12-31`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `exemplo_${selectedApi || 'planilha'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Planilha de exemplo baixada com sucesso');
  };

  const handleUpload = async () => {
    if (!selectedApi) {
      toast.error('Selecione uma API');
      return;
    }

    if (!file) {
      toast.error('Selecione um arquivo');
      return;
    }

    try {
      // Mock: simula upload para S3 (na realidade seria um POST para backend que faz storagePut)
      const mockFileUrl = `https://storage.example.com/uploads/${Date.now()}_${file.name}`;
      
      const result = await createUploadMutation.mutateAsync({
        apiProvider: selectedApi,
        fileName: file.name,
        fileUrl: mockFileUrl,
      });

      setUploadResult(result);
      setShowResultModal(true);
      utils.upload.list.invalidate();
      utils.apiConfig.list.invalidate();
      
      // Limpa o formulário
      setFile(null);
      setSelectedApi('');
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      toast.error('Erro ao fazer upload');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload de Planilhas</h1>
          <p className="text-muted-foreground mt-2">
            Envie planilhas para processamento através das APIs configuradas
          </p>
        </div>

        {activeApis.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhuma API Ativa</CardTitle>
              <CardDescription>
                Você precisa configurar e ativar pelo menos uma API antes de fazer uploads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/config'}>
                Ir para Configurações
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Enviar Planilha</CardTitle>
              <CardDescription>
                Selecione a API e faça upload do arquivo CSV ou Excel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-select">Selecione a API</Label>
                <Select value={selectedApi} onValueChange={setSelectedApi}>
                  <SelectTrigger id="api-select">
                    <SelectValue placeholder="Escolha uma API" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeApis.map((config) => (
                      <SelectItem key={config.id} value={config.apiProvider}>
                        {config.apiProvider === 'asaas' ? 'Asaas' : 'Cobre Fácil'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedApi && (
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={handleDownloadExample}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Planilha de Exemplo
                  </Button>

                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Arquivo</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                    </div>
                    {file && (
                      <p className="text-sm text-muted-foreground">
                        Arquivo selecionado: {file.name}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={!file || createUploadMutation.isPending}
                    className="w-full"
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    {createUploadMutation.isPending ? 'Enviando...' : 'Fazer Upload'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {uploadResult?.success ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Upload Bem-sucedido
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Erro no Upload
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {uploadResult?.success 
                ? 'Sua planilha foi processada com sucesso'
                : 'Ocorreram erros ao processar sua planilha'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {uploadResult?.success && uploadResult.result.processedRows !== undefined && (
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="font-medium text-green-900 dark:text-green-100">
                  {uploadResult.result.processedRows} linhas processadas com sucesso
                </p>
              </div>
            )}

            {uploadResult?.result.errors && uploadResult.result.errors.length > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg space-y-2">
                <p className="font-medium text-red-900 dark:text-red-100">Erros encontrados:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                  {uploadResult.result.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={() => setShowResultModal(false)} className="w-full">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
