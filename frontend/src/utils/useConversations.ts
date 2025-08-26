import { useQuery } from '@tanstack/react-query';
import { axiosClient } from './axios';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await axiosClient.get('/messages/conversations');
      return res.data;
    },
  });
};
