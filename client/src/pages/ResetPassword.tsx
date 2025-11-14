import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE } from "@/const";
import { resetPassword } from "@/lib/api";
import { Eye, EyeOff, Lock, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [params] = useRoute("/reset-password");
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const newErrors = {
      password: '',
      confirmPassword: '',
    };

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A nova senha deve ter no mínimo 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!token) {
      toast.error('Token de recuperação não encontrado');
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token, formData.password);
      toast.success('Senha redefinida com sucesso!');
      setLocation('/login');
    } catch (error: any) {
      console.error('Reset password error:', error);

      // Tratar códigos de erro específicos
      if (error.code === 'PASSWORD_RESET_TOKEN_INVALID') {
        toast.error('Link de recuperação de senha inválido. Solicite um novo link.');
      } else if (error.code === 'PASSWORD_RESET_TOKEN_ALREADY_USED') {
        toast.error('Este link de recuperação já foi utilizado. Solicite um novo se necessário.');
      } else if (error.code === 'PASSWORD_RESET_TOKEN_EXPIRED') {
        toast.error('Link de recuperação de senha expirado. Solicite um novo link.');
      } else if (error.code === 'PASSWORD_TOO_SHORT') {
        toast.error('A nova senha deve ter no mínimo 6 caracteres.');
      } else {
        toast.error(error.message || 'Erro ao redefinir senha');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verificar se token existe
  useEffect(() => {
    if (!token) {
      toast.error('Token de recuperação não encontrado');
      setLocation('/forgot-password');
    }
  }, [token, setLocation]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
        <div className="w-full max-w-md space-y-8">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              <CardTitle className="text-xl">Link Inválido</CardTitle>
              <CardDescription>
                Token de recuperação não encontrado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation('/forgot-password')} className="w-full">
                Solicitar Novo Link
              </Button>
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
              Redefinir Senha
            </h1>
            <p className="text-muted-foreground">
              Digite sua nova senha
            </p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Nova Senha</CardTitle>
            <CardDescription>
              Escolha uma senha forte e segura
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua nova senha"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua nova senha"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redefinindo...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Redefinir Senha
                  </>
                )}
              </Button>
            </form>
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
