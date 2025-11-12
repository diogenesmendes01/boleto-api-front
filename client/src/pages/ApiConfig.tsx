import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

interface ApiProviderConfig {
  provider: string;
  name: string;
  description: string;
}

const API_PROVIDERS: ApiProviderConfig[] = [
  {
    provider: 'asaas',
    name: 'Asaas',
    description: 'Plataforma de pagamentos e cobranças online',
  },
  {
    provider: 'cobrefacil',
    name: 'Cobre Fácil',
    description: 'Sistema de cobrança e gestão financeira',
  },
];

export default function ApiConfig() {
  const { data: configs, isLoading, refetch } = trpc.apiConfig.list.useQuery();
  const upsertMutation = trpc.apiConfig.upsert.useMutation();
  const utils = trpc.useUtils();

  const [formData, setFormData] = useState<Record<string, { apiKey: string; apiSecret: string; isActive: boolean }>>({});

  const getConfigForProvider = (provider: string) => {
    return configs?.find(c => c.apiProvider === provider);
  };

  const handleToggle = async (provider: string, checked: boolean) => {
    const config = getConfigForProvider(provider);
    
    try {
      await upsertMutation.mutateAsync({
        apiProvider: provider,
        isActive: checked ? 1 : 0,
        apiKey: config?.apiKey || '',
        apiSecret: config?.apiSecret || '',
      });
      
      utils.apiConfig.list.invalidate();
      toast.success(checked ? 'API ativada com sucesso' : 'API desativada com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar configuração');
    }
  };

  const handleSaveConfig = async (provider: string) => {
    const data = formData[provider];
    if (!data) return;

    try {
      await upsertMutation.mutateAsync({
        apiProvider: provider,
        isActive: getConfigForProvider(provider)?.isActive || 0,
        apiKey: data.apiKey,
        apiSecret: data.apiSecret,
      });
      
      utils.apiConfig.list.invalidate();
      toast.success('Configuração salva com sucesso');
      
      // Limpa o formulário
      setFormData(prev => {
        const newData = { ...prev };
        delete newData[provider];
        return newData;
      });
    } catch (error) {
      toast.error('Erro ao salvar configuração');
    }
  };

  const updateFormData = (provider: string, field: 'apiKey' | 'apiSecret', value: string) => {
    setFormData(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        apiKey: field === 'apiKey' ? value : prev[provider]?.apiKey || '',
        apiSecret: field === 'apiSecret' ? value : prev[provider]?.apiSecret || '',
        isActive: prev[provider]?.isActive || false,
      },
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Configuração de APIs</h1>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configuração de APIs</h1>
          <p className="text-muted-foreground mt-2">
            Configure as APIs que você deseja integrar ao ConectaAPI
          </p>
        </div>

        <div className="space-y-4">
          {API_PROVIDERS.map((apiProvider) => {
            const config = getConfigForProvider(apiProvider.provider);
            const isActive = config?.isActive === 1;
            const currentFormData = formData[apiProvider.provider];

            return (
              <Card key={apiProvider.provider}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{apiProvider.name}</CardTitle>
                      <CardDescription>{apiProvider.description}</CardDescription>
                    </div>
                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) => handleToggle(apiProvider.provider, checked)}
                    />
                  </div>
                </CardHeader>
                
                {isActive && (
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${apiProvider.provider}-key`}>API Key</Label>
                      <Input
                        id={`${apiProvider.provider}-key`}
                        type="password"
                        placeholder="Digite sua API Key"
                        value={currentFormData?.apiKey || config?.apiKey || ''}
                        onChange={(e) => updateFormData(apiProvider.provider, 'apiKey', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`${apiProvider.provider}-secret`}>API Secret</Label>
                      <Input
                        id={`${apiProvider.provider}-secret`}
                        type="password"
                        placeholder="Digite seu API Secret"
                        value={currentFormData?.apiSecret || config?.apiSecret || ''}
                        onChange={(e) => updateFormData(apiProvider.provider, 'apiSecret', e.target.value)}
                      />
                    </div>

                    <Button 
                      onClick={() => handleSaveConfig(apiProvider.provider)}
                      disabled={upsertMutation.isPending}
                    >
                      {upsertMutation.isPending ? 'Salvando...' : 'Salvar Configuração'}
                    </Button>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
