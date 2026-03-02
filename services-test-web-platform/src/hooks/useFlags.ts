import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { flagApi } from '../services/api';

export interface FeatureFlag {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export const useFlags = () => {
  const queryClient = useQueryClient();

  const flagsQuery = useQuery({
    queryKey: ['flags'],
    queryFn: async () => {
      const response = await flagApi.get<FeatureFlag[]>('/flags');
      return response.data;
    },
  });

  const createFlagMutation = useMutation({
    mutationFn: async (newFlag: { name: string; description: string }) => {
      const response = await flagApi.post('/flags', newFlag);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flags'] });
      toast.success('Feature Flag criada com sucesso!');
    },
    onError: () => {
      toast.error('Ocorreu um erro ao criar a flag.');
    },
  });

  const toggleFlagMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      const response = await flagApi.put(`/flags/${id}`, { is_active });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['flags'] });
      const status = variables.is_active ? 'ativada' : 'desativada';
      toast.info(`Flag ${status} com sucesso.`);
    },
    onError: () => {
      toast.error('Erro ao alterar status da flag.');
    },
  });

  const deleteFlagMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await flagApi.delete(`/flags/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flags'] });
      toast.success('Flag excluída permanentemente.');
    },
    onError: () => {
      toast.error('Erro ao excluir a flag.');
    },
  });

  return {
    flags: flagsQuery.data || [],
    isLoading: flagsQuery.isLoading,
    error: flagsQuery.error,
    createFlag: createFlagMutation.mutateAsync,
    isCreating: createFlagMutation.isPending,
    toggleFlag: toggleFlagMutation.mutate,
    deleteFlag: deleteFlagMutation.mutateAsync,
    refetch: flagsQuery.refetch,
  };
};
