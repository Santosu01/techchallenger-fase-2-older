import React, { useState } from 'react';
import { Key, Copy, Check, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../hooks/useAuth';
import FormField from '../components/form/FormField';
import Input from '../components/form/Input';
import Button from '../components/ui/Button';

const authSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Use apenas letras minúsculas, números e hífens'),
});

type AuthFormData = z.infer<typeof authSchema>;

const AuthPage: React.FC = () => {
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { createKey, isCreating } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    const response = await createKey(data.name);
    if (response?.api_key) {
      setCreatedKey(response.api_key);
      reset();
    }
  };

  const copyToClipboard = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      toast.success('Chave copiada para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-500">
            <Key className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold italic tracking-tight">Authentication Service</h2>
        </div>
        <p className="text-text-secondary max-w-2xl leading-relaxed">
          Gerencie as credenciais de acesso para seus microserviços. Gere chaves de API seguras para
          autenticação entre o motor de avaliação e aplicações clientes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Creation Form */}
        <section className="glass rounded-[2rem] p-10 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <ShieldCheck className="w-40 h-40 text-white" />
          </div>

          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            Nova Chave de Serviço
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <FormField
              label="Nome Identificador"
              error={errors.name?.message}
              description="Use um nome que facilite identificar onde a chave será usada."
              required
            >
              <Input
                {...register('name')}
                placeholder="ex: prod-web-gateway"
                error={!!errors.name}
              />
            </FormField>

            <Button type="submit" isLoading={isCreating} className="w-full" size="lg">
              Gerar Chave de API
            </Button>
          </form>
        </section>

        {/* Result Area */}
        <section className="flex flex-col">
          {createdKey ? (
            <div className="glass-card rounded-[2rem] p-10 border border-emerald-500/20 bg-emerald-500/[0.02] animate-in zoom-in-95 duration-500 flex-1 flex flex-col justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-500 mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">Chave Gerada!</h3>
              <p className="text-text-secondary text-sm text-center mb-8">
                Copie e guarde esta chave em um local seguro.
              </p>

              <div className="relative group">
                <div className="w-full bg-black/40 border border-emerald-500/30 rounded-2xl p-6 font-mono text-emerald-400 break-all text-center text-sm shadow-inner">
                  {createdKey}
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 hover:bg-emerald-500/20 rounded-xl text-emerald-400 transition-all"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setCreatedKey(null)}
                className="mt-8 text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] hover:text-white transition-colors mx-auto"
              >
                Gerar Outra
              </button>
            </div>
          ) : (
            <div className="glass rounded-[2rem] p-10 border border-white/5 flex-1 flex flex-col items-center justify-center text-center opacity-40 italic">
              <ShieldCheck className="w-16 h-16 mb-6 opacity-20" />
              <p className="text-text-secondary">
                Sua nova chave de API aparecerá aqui após a criação.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
