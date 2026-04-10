import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DollarSign } from 'lucide-react';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres'); return; }
    setError('');
    setLoading(true);
    try {
      await signUp(email, password, name);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✉️</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Verifique seu e-mail</h2>
          <p className="text-muted-foreground mb-6">
            Enviamos um link de confirmação para <strong>{email}</strong>. Clique no link para ativar sua conta.
          </p>
          <Link to="/login">
            <Button variant="outline" className="w-full">Ir para o login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">FinanceApp</h1>
          <p className="text-muted-foreground mt-1">Crie sua conta gratuita</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">Criar conta</h2>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input id="name" label="Nome" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} />
            <Input id="email" label="E-mail" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input id="password" label="Senha" type="password" placeholder="Mín. 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required />
            <Button type="submit" loading={loading} className="w-full mt-2">Criar conta</Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
