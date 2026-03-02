import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { targetingApi } from '../services/api';

export interface Rule {
  id: number;
  flag_name: string;
  rule_type: string;
  rule_value: string;
  rollout_percent: number;
}

export const useTargeting = () => {
  const queryClient = useQueryClient();

  const rulesQuery = useQuery({
    queryKey: ['rules'],
    queryFn: async () => {
      const response = await targetingApi.get<Rule[]>('/rules');
      return response.data;
    },
  });

  const createRuleMutation = useMutation({
    mutationFn: async (newRule: Omit<Rule, 'id'>) => {
      const response = await targetingApi.post('/rules', newRule);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      toast.success('Regra de segmentação adicionada.');
    },
    onError: () => {
      toast.error('Erro ao criar regra.');
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await targetingApi.delete(`/rules/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      toast.success('Regra removida com sucesso.');
    },
    onError: () => {
      toast.error('Erro ao remover regra.');
    },
  });

  return {
    rules: rulesQuery.data || [],
    isLoading: rulesQuery.isLoading,
    error: rulesQuery.error,
    createRule: createRuleMutation.mutateAsync,
    isCreating: createRuleMutation.isPending,
    deleteRule: deleteRuleMutation.mutateAsync,
    refetch: rulesQuery.refetch,
  };
};
