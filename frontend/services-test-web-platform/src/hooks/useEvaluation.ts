import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { evaluationApi } from '../services/api';

interface EvaluationParams {
  user_id: string;
  flag_name: string;
  apiKey: string;
}

export const useEvaluation = () => {
  const evaluateMutation = useMutation({
    mutationFn: async ({ user_id, flag_name, apiKey }: EvaluationParams) => {
      const response = await evaluationApi.get('/evaluate', {
        params: { user_id, flag_name },
        headers: {
          'X-API-Key': apiKey,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Avaliação executada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao executar avaliação.', {
        description: 'Verifique se a API Key é válida e se o serviço está online.',
      });
    },
  });

  return {
    evaluate: evaluateMutation.mutateAsync,
    isEvaluating: evaluateMutation.isPending,
    error: evaluateMutation.error,
    result: evaluateMutation.data,
    reset: evaluateMutation.reset,
  };
};
