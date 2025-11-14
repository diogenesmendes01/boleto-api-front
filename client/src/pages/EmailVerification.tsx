import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE } from "@/const";
import { resendVerificationEmail } from "@/lib/api";
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useLocation, useRoute, useSearch } from "wouter";
import { toast } from "sonner";

export default function EmailVerification() {
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const email = new URLSearchParams(searchParams).get('email') || '';
  const companyId = new URLSearchParams(searchParams).get('companyId') || '';

  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Email não encontrado');
      return;
    }

    setIsResending(true);
    setResendSuccess(false);

    try {
      await resendVerificationEmail(email);
      setResendSuccess(true);
      toast.success('Email de verificação reenviado!');
    } catch (error: any) {
      console.error('Resend email error:', error);

      // Verificar códigos de erro específicos
      if (error.code === 'EMAIL_ALREADY_VERIFIED') {
        toast.success('Este e-mail já foi verificado. Você pode fazer login normalmente.');
        setLocation('/login');
        return;
      }

      // Fallback para erros genéricos
      toast.error(error.message || 'Erro ao reenviar email');
    } finally {
      setIsResending(false);
    }
  };

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
              Verifique seu email
            </h1>
            <p className="text-muted-foreground">
              Enviamos um link de verificação para você
            </p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl">Confirme seu endereço de email</CardTitle>
            <CardDescription>
              Clique no link enviado para seu email para ativar sua conta
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Informações da conta */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email cadastrado</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted"
                  />
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Este é o email que será usado para acessar sua conta
                </p>
              </div>

              {companyId && (
                <div className="space-y-2">
                  <Label>ID da Empresa</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={companyId}
                      disabled
                      className="bg-muted font-mono text-sm"
                    />
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Identificador único da sua empresa no sistema
                  </p>
                </div>
              )}
            </div>

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
                <RefreshCw className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>O link de ativação expira em 24 horas</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Clique no link "Ativar Conta" no email</span>
              </div>
            </div>

            {/* Botão reenviar */}
            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Reenviando...
                  </>
                ) : resendSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Email reenviado!
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Não recebeu o email? Reenviar
                  </>
                )}
              </Button>

              {resendSuccess && (
                <p className="text-sm text-green-600 text-center">
                  Um novo email foi enviado para {email}
                </p>
              )}
            </div>

            {/* Botões de navegação */}
            <div className="space-y-2">
              <Button
                onClick={() => setLocation('/login')}
                className="w-full"
              >
                Já verifiquei meu email
              </Button>

              <Button
                onClick={() => setLocation('/cadastro')}
                variant="ghost"
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao cadastro
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
