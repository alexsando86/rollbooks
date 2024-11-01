import connectToDatabase from '@/lib/mongodb';
import User from '@/pages/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'POST') {
    try {
      const { employeeId, password, name, access } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = new User({
        employeeId,
        password: hashedPassword,
        name,
        access,
      });

      const savedAdmin = await admin.save();
      res
        .status(201)
        .json({ message: '관리자 계정이 생성되었습니다.', user: savedAdmin });
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ message: '관리자 계정 생성에 실패했습니다.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
