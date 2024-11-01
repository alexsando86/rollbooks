import axios from 'axios';

export const createUser = async (employeeId, password, name) => {
  try {
    const response = await axios.post('/api/create-user', {
      employeeId,
      password,
      name,
      access: 0,
    });
    console.log('계정이 생성되었습니다.:', response.data);
  } catch (error) {
    console.error(
      'Error creating user:',
      error.response ? error.response.data : error.message
    );
  }
};
