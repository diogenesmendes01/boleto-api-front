import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";

interface ApiProviderConfig {
  provider: string;
  name: string;
  description: string;
  logo: string;
}

const API_PROVIDERS: ApiProviderConfig[] = [
  {
    provider: 'asaas',
    name: 'Asaas',
    description: 'Plataforma completa de pagamentos e cobranças online com boletos, cartão e PIX',
    logo: '🏦',
  },
  {
    provider: 'cobrefacil',
    name: 'Cobre Fácil',
    description: 'Sistema de cobrança e gestão financeira para empresas de todos os tamanhos',
    logo: '💳',
  },
];

export default function ApiConfig() {
  const { data: configs, isLoading, refetch } = trpc.apiConfig.list.useQuery();
  const upsertMutation = trpc.apiConfig.upsert.useMutation();
  const utils = trpc.useUtils();

  const [formData, setFormData] = useState<Record<string, { apiKey: string; apiSecret: string; isActive: boolean }>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, { key: boolean; secret: boolean }>>({});

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

  const toggleSecretVisibility = (provider: string, field: 'key' | 'secret') => {
    setShowSecrets(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        key: field === 'key' ? !prev[provider]?.key : prev[provider]?.key || false,
        secret: field === 'secret' ? !prev[provider]?.secret : prev[provider]?.secret || false,
      },
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Configuração de APIs</h1>
            <p className="text-lg text-muted-foreground mt-2">Carregando...</p>
          </div>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <Card key={i} className="border-2">
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-96" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Configuração de APIs</h1>
          <p className="text-lg text-muted-foreground">
            Configure as APIs que você deseja integrar ao ConectaAPI
          </p>
        </div>

        {/* APIs Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {API_PROVIDERS.map((apiProvider) => {
            const config = getConfigForProvider(apiProvider.provider);
            const isActive = config?.isActive === 1;
            const currentFormData = formData[apiProvider.provider];
            const secrets = showSecrets[apiProvider.provider] || { key: false, secret: false };

            return (
              <Card key={apiProvider.provider} className={`border-2 transition-all duration-300 ${isActive ? 'border-primary/50 shadow-lg' : 'hover:border-muted-foreground/20'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-5xl">{apiProvider.logo}</div>
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-2xl flex items-center gap-2">
                          {apiProvider.name}
                          {isActive && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs font-medium">
                              <CheckCircle2 className="h-3 w-3" />
                              Ativa
                            </span>
                          )}
                          {!isActive && config && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 text-xs font-medium">
                              <XCircle className="h-3 w-3" />
                              Inativa
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {apiProvider.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) => handleToggle(apiProvider.provider, checked)}
                      className="mt-1"
                    />
                  </div>
                </CardHeader>
                
                {isActive && (
                  <CardContent className="space-y-6 pt-6 border-t">
                    <div className="space-y-4">
                      {/* API Key */}
                      <div className="space-y-2">
                        <Label htmlFor={`${apiProvider.provider}-key`} className="text-sm font-semibold">
                          API Key
                        </Label>
                        <div className="relative">
                          <Input
                            id={`${apiProvider.provider}-key`}
                            type={secrets.key ? "text" : "password"}
                            placeholder="Digite sua API Key"
                            value={currentFormData?.apiKey || config?.apiKey || ''}
                            onChange={(e) => updateFormData(apiProvider.provider, 'apiKey', e.target.value)}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => toggleSecretVisibility(apiProvider.provider, 'key')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {secrets.key ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      {/* API Secret */}
                      <div className="space-y-2">
                        <Label htmlFor={`${apiProvider.provider}-secret`} className="text-sm font-semibold">
                          API Secret
                        </Label>
                        <div className="relative">
                          <Input
                            id={`${apiProvider.provider}-secret`}
                            type={secrets.secret ? "text" : "password"}
                            placeholder="Digite seu API Secret"
                            value={currentFormData?.apiSecret || config?.apiSecret || ''}
                            onChange={(e) => updateFormData(apiProvider.provider, 'apiSecret', e.target.value)}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => toggleSecretVisibility(apiProvider.provider, 'secret')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {secrets.secret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleSaveConfig(apiProvider.provider)}
                      disabled={upsertMutation.isPending}
                      className="w-full"
                      size="lg"
                    >
                      {upsertMutation.isPending ? 'Salvando...' : 'Salvar Configuração'}
                    </Button>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Info Box */}
        <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="text-3xl">ℹ️</div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Dicas de Segurança</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Suas credenciais são armazenadas de forma segura e criptografada</li>
                  <li>• Nunca compartilhe suas API Keys com terceiros</li>
                  <li>• Desative APIs que não estiver utilizando</li>
                  <li>• Atualize suas credenciais periodicamente</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
