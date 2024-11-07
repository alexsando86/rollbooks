import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

import { fetchAllUsers, createUser } from '@/lib/userService';

export default async function handler(req, res) {
  const connection = await connectToDatabase();
  if (connection) {
    console.log('Connected to MongoDB successfully!');
  } else {
    console.error('Failed to connect to MongoDB.');
  }

  if (req.method === 'GET') {
    try {
      const users = await fetchAllUsers();

      res.status(200).json(users);
    } catch (error) {
      console.error('사용자 목록 불러오기 실패:', error);
      res
        .status(500)
        .json({ message: '사용자 목록을 불러오는데 실패했습니다.' });
    }
  } else if (req.method === 'POST') {
    try {
      const { employeeId, password } = req.body;
      const existingUser = await User.findOne({ employeeId });

      if (existingUser) {
        alert('해당 사번으로 된 사용자가 이미 존재합니다.');

        return res
          .status(409)
          .json({ message: '해당 사번이 이미 존재합니다.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await createUser({
        ...req.body,
        password: hashedPassword,
      });
      res
        .status(201)
        .json({ message: '사용자 계정이 생성되었습니다.', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: '사용자 계정 생성에 실패했습니다.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
