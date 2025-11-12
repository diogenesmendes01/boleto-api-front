import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload as UploadIcon, 
  FileText, 
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { uploadCustomersImport } from "@/lib/api";

export default function UploadNew() {
  const [, setLocation] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tipo de arquivo
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/json'];
      const validExtensions = ['.csv', '.json', '.ndjson'];
      const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (!validTypes.includes(file.type) && !hasValidExtension) {
        toast.error('Formato de arquivo inválido. Use CSV ou NDJSON.');
        return;
      }

      // Validar tamanho (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        toast.error('Arquivo muito grande. Tamanho máximo: 50MB');
        return;
      }

      setSelectedFile(file);
      toast.success(`Arquivo "${file.name}" selecionado`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Selecione um arquivo primeiro');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadCustomersImport(selectedFile);
      
      toast.success(
        `Upload realizado com sucesso! ${result.received_count} registros recebidos.`,
        {
          duration: 5000,
        }
      );

      // Redirecionar para página de acompanhamento
      setLocation(`/import/${result.import_id}`);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Gerar CSV de exemplo
    const csvContent = `person_type,taxpayer_id,ein,personal_name,company_name,email,email_cc,telephone,cellular,addr_description,zipcode,street,number,complement,neighborhood,city,state
1,12345678900,,João da Silva,,joao@email.com,,11987654321,11987654321,,01310100,Avenida Paulista,1000,Sala 10,Bela Vista,São Paulo,SP
2,,12345678000190,,Empresa LTDA,contato@empresa.com,,1133334444,11988887777,,04543011,Avenida Brigadeiro Faria Lima,1500,,Jardim Paulistano,São Paulo,SP`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_importacao_clientes.csv';
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success('Template baixado com sucesso!');
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Importação em Lote</h1>
        <p className="text-muted-foreground">
          Importe até 100.000 clientes de uma vez usando arquivo CSV ou NDJSON
        </p>
      </div>

      {/* Instruções */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <AlertCircle className="h-5 w-5" />
            Como funciona
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-blue-900">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">
              1
            </div>
            <p>Baixe o template CSV e preencha com os dados dos clientes</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">
              2
            </div>
            <p>Faça o upload do arquivo preenchido (máx. 50MB)</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">
              3
            </div>
            <p>Acompanhe o progresso em tempo real na tela de status</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">
              4
            </div>
            <p>Reprocesse falhas com um clique, se necessário</p>
          </div>
        </CardContent>
      </Card>

      {/* Download Template */}
      <Card>
        <CardHeader>
          <CardTitle>1. Baixar Template</CardTitle>
          <CardDescription>
            Baixe o arquivo de exemplo com o formato correto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar Template CSV
          </Button>
        </CardContent>
      </Card>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle>2. Fazer Upload</CardTitle>
          <CardDescription>
            Selecione o arquivo CSV ou NDJSON preenchido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Arquivo</Label>
            <Input
              id="file"
              type="file"
              accept=".csv,.json,.ndjson"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>

          {selectedFile && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-900">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-green-700">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <UploadIcon className="mr-2 h-5 w-5" />
                Iniciar Importação
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Formato do Arquivo */}
      <Card>
        <CardHeader>
          <CardTitle>Formato do Arquivo CSV</CardTitle>
          <CardDescription>
            Estrutura esperada do arquivo de importação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Campos Obrigatórios (Pessoa Física):</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><code>person_type=1</code></li>
                <li><code>taxpayer_id</code> (CPF)</li>
                <li><code>personal_name</code></li>
                <li>Endereço completo: <code>zipcode, street, number, neighborhood, city, state</code></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Campos Obrigatórios (Pessoa Jurídica):</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><code>person_type=2</code></li>
                <li><code>ein</code> (CNPJ)</li>
                <li><code>company_name</code></li>
                <li>Endereço completo: <code>zipcode, street, number, neighborhood, city, state</code></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Campos Opcionais:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><code>email, email_cc</code></li>
                <li><code>telephone, cellular</code></li>
                <li><code>addr_description, complement</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
