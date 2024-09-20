import connectToDatabase from '../../lib/mongodb';
import mongoose from 'mongoose';
import dayjs from 'dayjs';

// 범용 데이터 모델 정의
const getModel = (collectionName) => {
  const Schema = new mongoose.Schema({
    name: String,
    email: String,
    createdAt: {
      type: Date,
      default: Date.now, // 서버 시간으로 자동 저장
    },
    month: {
      type: String, // 저장되는 달 (예: '2024-09')
      required: true,
    },
  });

  return (
    mongoose.models[collectionName] || mongoose.model(collectionName, Schema)
  );
};

export default async function handler(req, res) {
  const { collection } = req.query; // URL 파라미터에서 컬렉션 이름 가져오기
  const Model = getModel(collection);

  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const { name, email } = req.body;

      // 현재 서버 시간을 기준으로 달(month)을 계산
      const currentMonth = dayjs().format('YYYY-MM'); // '2024-09' 형식

      // 새로운 문서를 DB에 저장
      const newData = new Model({
        name,
        email,
        createdAt: new Date(), // 현재 서버 시간 저장
        month: currentMonth,
      });

      await newData.save();

      // 저장된 createdAt 값을 yyyy-mm-dd-hh:mm 형식으로 변환
      const formattedCreatedAt = dayjs(newData.createdAt).format(
        'YYYY-MM-DD-HH:mm'
      );

      console.log('newData', newData);

      res.status(201).json({
        message: '데이터 저장 성공',
        data: [
          {
            name: name,
            email: email,
            month: newData.month,
            createdAt: formattedCreatedAt,
          },
        ],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '데이터 저장 실패' });
    }
  }

  if (req.method === 'GET') {
    try {
      const db = await connectToDatabase();
      const modelData = await Model.find({});

      // 데이터를 클라이언트로 응답 (서버 시간 포함)
      const responseData = modelData.map((doc) => ({
        id: doc._id,
        name: doc.name,
        email: doc.email,
        month: doc.month,
        createdAt: dayjs(doc.createdAt).format('YYYY-MM-DD-HH:mm'), // 서버 시간을 원하는 형식으로 변환
      }));

      res.status(200).json({
        message: '데이터 조회 성공',
        data: responseData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '데이터 조회 실패' });
    }
  } else {
    res.status(405).json({ message: '허용되지 않은 메서드' });
  }
}
