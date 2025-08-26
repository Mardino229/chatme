import { useQuery } from '@tanstack/react-query';
import { axiosClient } from './axios';

export const useMessages = (id: string | undefined) => {
  return useQuery({
    queryKey: ['messages', id],
    queryFn: async () => {
      if (!id) return { messages: [] };
      const res = await axiosClient.get(`/messages/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};
