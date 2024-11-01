import axios from 'axios';

export const createAdmin = async (adminId, adminPassword) => {
  try {
    const response = await axios.post('/api/create-admin', {
      employeeId: adminId,
      password: adminPassword,
      name: '관리자',
      access: -1,
    });
    console.log('관리자 계정이 생성되었습니다.:', response.data);
  } catch (error) {
    console.error(
      'Error creating admin:',
      error.response ? error.response.data : error.message
    );
  }
};
