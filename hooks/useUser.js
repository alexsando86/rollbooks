import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, fetchAllUsers } from '@/lib/userService';

export const useUser = () => {
  const queryClient = useQueryClient();

  const fetchAllUsersQuery = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      console.error('계정 생성 중 에러가 발생했습니다.:', error);
    },
  });

  return {
    users: fetchAllUsersQuery.data,
    createUserMutation,
  };
};
