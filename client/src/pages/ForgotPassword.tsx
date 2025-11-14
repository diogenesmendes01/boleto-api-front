import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE } from "@/const";
import { forgotPassword } from "@/lib/api";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
  });

  const validateForm = () => {
    const newErrors = {
      email: '',
    };

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      setIsSuccess(true);
      toast.success('Email de recuperação enviado!', {
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
        duration: 6000,
      });
    } catch (error: any) {
      console.error('Forgot password error:', error);

      // Para segurança, sempre mostramos sucesso mesmo se email não existir
      setIsSuccess(true);
      toast.success('Email de recuperação enviado!', {
        description: 'Se o email existir em nossa base, você receberá instruções para redefinir sua senha.',
        duration: 6000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo e Título */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                <img src={APP_LOGO} alt={APP_TITLE} className="relative h-16 w-16 rounded-lg" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Email Enviado!
              </h1>
              <p className="text-muted-foreground">
                Verifique sua caixa de entrada
              </p>
            </div>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center space-y-2">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-xl">Instruções Enviadas</CardTitle>
              <CardDescription>
                Enviamos um link de recuperação para seu email. Clique no link para redefinir sua senha.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Instruções */}
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <Mail className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Verifique sua caixa de entrada principal</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Mail className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Confira também as pastas: Spam, Lixo Eletrônico ou Promoções</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Loader2 className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>O link expira em 2 horas</span>
                </div>
              </div>

              {/* Botões */}
              <div className="space-y-2">
                <Button onClick={() => setLocation('/login')} className="w-full">
                  Voltar ao Login
                </Button>
                <Button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                  }}
                  variant="ghost"
                  className="w-full"
                >
                  Tentar Outro Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Título */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <img src={APP_LOGO} alt={APP_TITLE} className="relative h-16 w-16 rounded-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Esqueci minha senha
            </h1>
            <p className="text-muted-foreground">
              Digite seu email para receber instruções de recuperação
            </p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Recuperar Senha</CardTitle>
            <CardDescription>
              Enviaremos um link seguro para você redefinir sua senha
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Email de Recuperação
                  </>
                )}
              </Button>
            </form>

            {/* Link voltar */}
            <div className="mt-6 text-center">
              <Button
                onClick={() => setLocation('/login')}
                variant="ghost"
                className="text-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Login
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Precisa de ajuda?{" "}
            <a href="mailto:suporte@boletoapi.com" className="text-primary hover:underline">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
