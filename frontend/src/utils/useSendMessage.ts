import { useMutation } from '@tanstack/react-query';
import { axiosClient } from './axios';

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (payload: { receiverId: string; content: string }) => {
      const res = await axiosClient.post('/messages', payload);
      return res.data;
    },
  });
};
