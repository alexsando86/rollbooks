import axios, { AxiosResponse } from 'axios';
import axiosInstance from '@/lib/axiosInstance';

interface LoginResponse {
  message: string;
  isLogin: boolean;
  user: {
    employeeId: string;
    name: string;
    access: number;
  };
}

export const createUser = async (data: {
  employeeId: string;
  password: string;
  name: string;
  access: number;
}): Promise<AxiosResponse<any>> => {
  try {
    const response = await axiosInstance.post('/user/create-user', data);

    return response;
  } catch (error: any) {
    console.error(
      '(createUser) 계정 생성 실패:',
      error.response ? error.response.data : error.message
    );

    throw error;
  }
};

export const loginUser = async (data: {
  employeeId: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post('/user/login', data);

    return response.data;
  } catch (error: any) {
    console.error(
      '(loginUser) 로그인 실패:',
      error.response ? error.response.data : error.message
    );

    throw error;
  }
};

// 모든 사용자 정보 불러오기
// import User from '@/lib/models/User';

// export const fetchAllUsers = async () => {
//   try {
//     // const response = await fetch('/api/user');
//     // console.log('fetchAllUsers response: ', response);

//     // if (!response.ok) {
//     //   throw new Error('유저 정보를 불러오는데 실패했습니다.');
//     // }
//     // return await response.json();

//     const users = await User?.find();

//     console.log('fetchAllUsers: ', users);
//     return users;
//   } catch (error) {
//     console.error('사용자 정보 불러오기 실패:', error);
//     throw new Error('사용자 정보를 불러오는데 실패했습니다.');
//   }
// };
