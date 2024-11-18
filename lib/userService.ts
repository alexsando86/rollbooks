import axios, { AxiosResponse } from 'axios';

export const createUser = async (data: {
  employeeId: string;
  password: string;
  name: string;
  access: number;
}): Promise<AxiosResponse<any>> => {
  try {
    const response = await axios.post('/api/user/create-user', data);
    console.log('계정이 생성되었습니다.:', response.data);

    return response;
  } catch (error: any) {
    console.error(
      'Error creating user:',
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
