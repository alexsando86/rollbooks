// 모든 사용자 정보 불러오기
import User from '@/lib/models/User';

export const fetchAllUsers = async () => {
  // const response = await fetch('/api/user');
  // console.log('fetchAllUsers response: ', response);

  // if (!response.ok) {
  //   throw new Error('유저 정보를 불러오는데 실패했습니다.');
  // }
  // return await response.json();
  try {
    const users = await User.find(); // Fetch users from the database
    console.log('users: ', users);
    return users; // Return the fetched users
  } catch (error) {
    console.error('사용자 정보 불러오기 실패:', error); // Log any errors that occur
    throw new Error('사용자 정보를 불러오는데 실패했습니다.'); // Throw a new error to be caught in the API route
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
