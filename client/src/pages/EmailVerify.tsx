import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE } from "@/const";
import { verifyEmail } from "@/lib/api";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";

export default function EmailVerify() {
  const [, setLocation] = useLocation();
  const [params] = useRoute("/email-verify");
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setMessage('Token de verificação não fornecido. Por favor, use o link enviado no email.');
      setIsVerifying(false);
      return;
    }

    const verifyEmailToken = async () => {
      try {
        const response = await verifyEmail(token);

        if (response.success) {
          setVerificationStatus('success');
          setMessage('Email verificado com sucesso! Você já pode fazer login.');
          toast.success('Email verificado com sucesso!');
        } else {
          throw new Error(response.message || 'Erro na verificação');
        }
      } catch (error: any) {
        console.error('Email verification error:', error);
        setVerificationStatus('error');

        // Tratar códigos de erro específicos
        if (error.code === 'TOKEN_MISSING') {
          setMessage('Token de verificação não fornecido. Por favor, use o link enviado no email.');
        } else if (error.code === 'EMAIL_TOKEN_INVALID') {
          setMessage('Link de verificação inválido. Solicite um novo email de ativação.');
        } else if (error.code === 'EMAIL_TOKEN_ALREADY_USED') {
          setMessage('Este link de verificação já foi utilizado. Se você já verificou seu email, pode fazer login.');
        } else if (error.code === 'EMAIL_TOKEN_EXPIRED') {
          setMessage('Link de verificação expirado. Solicite um novo email de ativação.');
        } else {
          setMessage(error.message || 'Erro ao verificar email');
        }

        toast.error(message);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmailToken();
  }, [token]);

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
              Verificação de Email
            </h1>
            <p className="text-muted-foreground">
              Verificando seu endereço de email...
            </p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              {isVerifying ? (
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              ) : verificationStatus === 'success' ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            <CardTitle className={`text-xl ${verificationStatus === 'success' ? 'text-green-600' : verificationStatus === 'error' ? 'text-red-600' : ''}`}>
              {isVerifying ? 'Verificando...' : verificationStatus === 'success' ? 'Email Verificado!' : 'Erro na Verificação'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <CardDescription className="text-center">
              {isVerifying ? (
                'Aguarde enquanto verificamos seu email...'
              ) : (
                message
              )}
            </CardDescription>

            {!isVerifying && (
              <div className="space-y-3">
                {verificationStatus === 'success' ? (
                  <Button onClick={() => setLocation('/login')} className="w-full">
                    Fazer Login
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button onClick={() => setLocation('/login')} className="w-full">
                      Ir para Login
                    </Button>
                    <Button
                      onClick={() => setLocation('/email-verification')}
                      variant="outline"
                      className="w-full"
                    >
                      Solicitar Novo Email
                    </Button>
                  </div>
                )}
              </div>
            )}
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
