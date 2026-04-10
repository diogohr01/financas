import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DollarSign } from 'lucide-react';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">FinanceApp</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas finanças com inteligência</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">Entrar na conta</h2>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Esqueci minha senha
              </Link>
            </div>
            <Button type="submit" loading={loading} className="w-full mt-2">
              Entrar
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Não tem conta?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
