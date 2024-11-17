import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { employeeId, password, name, access = 0 } = req.body;

      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db('mongodbnode'); // 카테고리
      //  db.collection('users'): 폴더명

      // Check if user exists
      const existingUser = await db.collection('users').findOne({ employeeId });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: '해당 사번이 이미 존재합니다.' });
      }

      // Hash password and save user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        employeeId,
        password: hashedPassword,
        name,
        access,
        createdAt: new Date(),
      };

      const result = await db.collection('users').insertOne(newUser);
      console.log('result: ', result);

      const insertedUser = await db
        .collection('users')
        .findOne({ _id: result.insertedId });
      console.log(insertedUser);

      const USER = access === -1 ? '관리자' : '사용자';

      if (result.acknowledged) {
        return { message: 'User created successfully', user: result.ops[0] };
      }

      res.status(201).json({
        message: `${USER} 계정이 생성되었습니다.`,
        user: result.ops[0],
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: `${USER} 계정 생성에 실패했습니다.` });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
