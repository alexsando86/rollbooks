import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { employeeId, password, name, access = 0 } = req.body;
      const USER = access === -1 ? '관리자' : '사용자';

      // MongoDB 연결
      const client = await clientPromise;
      const db = client.db('mongodbnode'); // 카테고리
      //  db.collection('users'): 폴더명

      // 사번 중복여부 체크
      const existingUser = await db.collection('users').findOne({ employeeId });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: '해당 사번이 이미 존재합니다.' });
      }

      // 비번 암호화
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        employeeId,
        password: hashedPassword,
        name,
        access,
        createdAt: new Date(),
      };

      const result = await db.collection('users').insertOne(newUser);

      if (result.acknowledged) {
        const user = await db
          .collection('users')
          .findOne({ _id: result.insertedId });

        return res
          .status(201)
          .json({ message: `${USER} 계정이 생성되었습니다.`, user });
      }

      res.status(201).json({
        message: `${USER} 계정이 생성되었습니다.`,
        user: result.ops[0],
      });
    } catch (error) {
      console.error('계정 생성 실패:', error);
      res.status(500).json({ message: `${USER} 계정 생성에 실패했습니다.` });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
