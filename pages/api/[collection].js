import connectToDatabase from '../../lib/mongodb';
import mongoose from 'mongoose';
import dayjs from 'dayjs';

// 범용 데이터 모델 정의
const getModel = (collectionName) => {
  const Schema = new mongoose.Schema({
    name: String,
    email: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongoose.models[collectionName] || mongoose.model(collectionName, Schema);
};

export default async function handler(req, res) {
  const { collection } = req.query; // URL 파라미터에서 컬렉션 이름 가져오기
  const Model = getModel(collection);

  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const { name, email } = req.body;
      const newData = new Model({ name, email });
      await newData.save();
      res.status(201).json({ 
        message: '데이터 저장 성공',
        data: {
          name: newData.name,
          email: newData.email,
          createdAt: dayjs(newData.createdAt).format('YYYY-MM-DD-HH:mm'),
          updatedAt: dayjs(newData.updatedAt).format('YYYY-MM-DD-HH:mm')
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '데이터 저장 실패' });
    }
  } else if (req.method === 'GET') {
    try {
      const db = await connectToDatabase();
      const data = await Model.find({});
      res.status(200).json({ 
        message: '데이터 조회 성공',
        data: data.map(item => ({
          name: item.name,
          email: item.email,
          createdAt: dayjs(item.createdAt).format('YYYY-MM-DD-HH:mm'),
          updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD-HH:mm')
        }))
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '데이터 조회 실패' });
    }
  } else {
    res.status(405).json({ message: '허용되지 않은 메서드' });
  }
}
