import connectToDatabase from '@/lib/mongodb';
import User from '@/pages/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'POST') {
    try {
      const { employeeId, password, name, access } = req.body;

      const existingUser = await User.findOne({ employeeId });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: '해당 사번이 이미 존재합니다.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        employeeId,
        password: hashedPassword,
        name,
        access,
      });

      const savedUser = await user.save();
      res
        .status(201)
        .json({ message: '사용자 계정이 생성되었습니다.', user: savedUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: '사용자 계정 생성에 실패했습니다.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
