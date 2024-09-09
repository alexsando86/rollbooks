import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
  const db = await connectToDatabase();
  res.status(200).json({ message: 'MongoDB 연결 성공!' });
}
