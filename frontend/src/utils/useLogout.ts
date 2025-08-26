import { useMutation } from '@tanstack/react-query';
import { axiosClient } from './axios';

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await axiosClient.post('/auth/logout');
    },
  });
};
