import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { employeeId, password } = req.body;

      const client = await clientPromise;
      const db = client.db('mongodbnode');

      const user = await db.collection('users').findOne({ employeeId });

      if (!user) {
        return res
          .status(401)
          .json({
            message: '해당 사번으로 된 사용자가 존재하지 않습니다.',
            isLogin: false,
          });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ message: '비밀번호가 일치하지 않습니다.', isLogin: false });
      }

      //   const token = jwt.sign(
      //     { employeeId: user.employeeId, access: user.access },
      //     process.env.JWT_SECRET,
      //     { expiresIn: '1h' }
      //   );

      return res.status(200).json({
        message: '로그인 성공',
        isLogin: true,
        user: {
          employeeId: user.employeeId,
          name: user.name,
          access: user.access,
          // 나중에 response로 받고싶은 값들을 이곳에 입력
        },
      });
    } catch (error) {
      console.error('로그인에 실패했습니다.:', error);
      res.status(500).json({ message: '로그인 서버 에러' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
