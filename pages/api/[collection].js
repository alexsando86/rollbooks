import connectToDatabase from '../../lib/mongodb';
import mongoose from 'mongoose';
import dayjs from 'dayjs';



// 범용 데이터 모델 정의
const getModel = (collectionName) => {
  const Schema = new mongoose.Schema({
    id: String,
    name: String,
    email: String
  });

  return mongoose.models[collectionName] || mongoose.model(collectionName, Schema);
};

export default async function handler(req, res) {
  const { collection } = req.query; // URL 파라미터에서 컬렉션 이름 가져오기
  const Model = getModel(collection);
  const serverTime = dayjs().format('YYYY-MM-DD-HH:mm');

  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const {id,  name, email } = req.body;
      const newData = new Model({ id, name, email });
      await newData.save();
      console.log('newData', newData)
      res.status(201).json({ 
        message: '데이터 저장 성공',
        serverTime,
        data: [
          {
            name: name,
            email: email,
            year: dayjs(newData.year).format('YYYY'),
            month: dayjs(newData.month).format('MM'),
            date: [
              {
                today: serverTime
              }
            ]
          }
        ]
      
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '데이터 저장 실패' });
    }
  } else if (req.method === 'GET') {
    try {
      const db = await connectToDatabase();
      const modelData = await Model.find({});
      
      res.status(200).json({ 
        message: '데이터 조회 성공',
        serverTime,
        data: modelData.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email
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
