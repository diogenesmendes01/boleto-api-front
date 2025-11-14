import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE } from "@/const";
import { login } from "@/lib/api";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Usar a função login da API externa
      const data = await login({
        email: formData.email,
        password: formData.password,
      });

      // Salvar token no localStorage (feito automaticamente pela função login)
      toast.success('Login realizado com sucesso!');
      setLocation('/dashboard');
      
    } catch (error: any) {
      console.error('Login error:', error);

      // Verificar códigos de erro específicos
      if (error.code === 'EMAIL_NOT_VERIFIED') {
        toast.error('Seu e-mail ainda não foi verificado. Por favor, verifique sua caixa de entrada e clique no link de ativação.');
        // Usar dados do erro para construir URL com informações completas
        const emailToVerify = error.data?.email || formData.email;
        const companyId = error.data?.companyId || '';
        const urlParams = new URLSearchParams({
          email: emailToVerify,
          ...(companyId && { companyId })
        });
        setLocation(`/email-verification?${urlParams.toString()}`);
        return;
      }

      if (error.code === 'INVALID_CREDENTIALS') {
        toast.error('E-mail ou senha incorretos. Por favor, verifique seus dados e tente novamente.');
        return;
      }

      if (error.code === 'ACCOUNT_DISABLED') {
        toast.error('Sua conta foi desativada. Entre em contato com o suporte para mais informações.');
        return;
      }

      // Fallback para erros genéricos
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Título */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
              <img 
                src={APP_LOGO} 
                alt={APP_TITLE} 
                className="relative h-20 w-20 rounded-2xl shadow-lg" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {APP_TITLE}
            </h1>
            <p className="text-muted-foreground text-lg">
              Faça login para continuar
            </p>
          </div>
        </div>

        {/* Card de Login */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>
              Digite seu email e senha para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setErrors({ ...errors, email: '' });
                    }}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-sm"
                    onClick={() => setLocation('/forgot-password')}
                  >
                    Esqueceu a senha?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setErrors({ ...errors, password: '' });
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Botão de Login */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            {/* Link para Cadastro */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Button
                variant="link"
                className="px-1"
                onClick={() => setLocation('/cadastro')}
              >
                Criar conta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Ao continuar, você concorda com nossos{' '}
          <Button variant="link" className="px-1 h-auto text-sm">
            Termos de Uso
          </Button>{' '}
          e{' '}
          <Button variant="link" className="px-1 h-auto text-sm">
            Política de Privacidade
          </Button>
        </p>
      </div>
    </div>
  );
}
