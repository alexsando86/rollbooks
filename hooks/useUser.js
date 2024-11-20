import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, fetchAllUsers, loginUser } from '@/lib/userService';
import { useToast } from '@chakra-ui/react';
import { CheckIcon, WarningIcon } from '@chakra-ui/icons';

export const useUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

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

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.isLogin) {
        toast({
          title: '로그인 성공',
          description: `${data.user.name}님 환영합니다!`,
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'bottom-right',
          icon: <CheckIcon color="white" boxSize={5} mr={2} />,
          containerStyle: {
            backgroundColor: 'green.500',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
          },
        });
      } else {
        toast({
          title: '로그인 실패',
          description: data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right',
          icon: <WarningIcon color="white" boxSize={5} mr={2} />,
          containerStyle: {
            backgroundColor: 'red.500',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
          },
        });
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || '로그인 실패. 다시 시도하세요.';

      toast({
        title: '로그인 실패',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
        icon: <WarningIcon color="white" boxSize={5} mr={2} />,
        containerStyle: {
          backgroundColor: 'red.500',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    },
  });

  return {
    users: fetchAllUsersQuery.data,
    createUserMutation,
    loginMutation,
  };
};
