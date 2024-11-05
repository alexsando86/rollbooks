// 모든 사용자 정보 불러오기
import User from '@/lib/models/User';

export const fetchAllUsers = async () => {
  try {
    // const response = await fetch('/api/user');
    // console.log('fetchAllUsers response: ', response);

    // if (!response.ok) {
    //   throw new Error('유저 정보를 불러오는데 실패했습니다.');
    // }
    // return await response.json();

    const users = await User.find();

    console.log('fetchAllUsers: ', users);
    return users;
  } catch (error) {
    console.error('사용자 정보 불러오기 실패:', error);
    throw new Error('사용자 정보를 불러오는데 실패했습니다.');
  }
};

// 사용자계정 생성하기
export const createUser = async (data) => {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('사용자계정 생성에 실패했습니다.');
  }
  return await response.json();
};
