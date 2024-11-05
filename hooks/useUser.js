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
  });

  return {
    users: fetchAllUsersQuery.data,
    createUserMutation,
  };
};
