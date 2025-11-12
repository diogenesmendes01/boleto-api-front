import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Eye, EyeOff, Loader2, Mail, Lock, Building2, User } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Cadastro() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    companyName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const newErrors = {
      companyName: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.companyName) {
      newErrors.companyName = 'Nome da empresa é obrigatório';
    }

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar conta');
      }

      toast.success('Conta criada com sucesso!');
      setLocation('/login');
      
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
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
              Crie sua conta empresarial
            </p>
          </div>
        </div>

        {/* Card de Cadastro */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para começar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome da Empresa */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Sua Empresa LTDA"
                    className={`pl-10 ${errors.companyName ? 'border-red-500' : ''}`}
                    value={formData.companyName}
                    onChange={(e) => {
                      setFormData({ ...formData, companyName: e.target.value });
                      setErrors({ ...errors, companyName: '' });
                    }}
                    disabled={isLoading}
                  />
                </div>
                {errors.companyName && (
                  <p className="text-sm text-red-500">{errors.companyName}</p>
                )}
              </div>

              {/* Nome do Responsável */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Responsável</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setErrors({ ...errors, name: '' });
                    }}
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Empresarial</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@empresa.com"
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
                <Label htmlFor="password">Senha</Label>
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

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      setErrors({ ...errors, confirmPassword: '' });
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Botão de Cadastro */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </form>

            {/* Link para Login */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Button
                variant="link"
                className="px-1"
                onClick={() => setLocation('/login')}
              >
                Fazer login
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Ao criar uma conta, você concorda com nossos{' '}
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
