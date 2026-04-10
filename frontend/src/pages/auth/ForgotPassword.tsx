import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DollarSign } from 'lucide-react';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
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
        </div>
        <div className="bg-card border border-border rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">E-mail enviado!</p>
              <p className="text-muted-foreground mb-6">Verifique sua caixa de entrada para redefinir sua senha.</p>
              <Link to="/login"><Button variant="outline" className="w-full">Voltar ao login</Button></Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2">Recuperar senha</h2>
              <p className="text-muted-foreground text-sm mb-6">Informe seu e-mail para receber o link de recuperação.</p>
              {error && <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input id="email" label="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <Button type="submit" loading={loading} className="w-full">Enviar link</Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-4">
                <Link to="/login" className="text-primary hover:underline">Voltar ao login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
