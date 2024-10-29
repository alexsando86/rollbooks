import clientPromise from '../../lib/mongodb'; // MongoDB 연결 설정 파일
// import Data from '../../models/Data'; // Mongoose 모델 임포트

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('mongodbnode'); // MongoDB 데이터베이스 이름을 입력하세요.
  const collection = db.collection('datas');

  const { yearMonth, id } = req.query;

  // GET 요청: yearMonth와 id를 기반으로 MongoDB에 저장된 현재 데이터 조회
  if (req.method === 'GET') {
    try {
      const data = await collection.findOne({ yearMonth, id }); // yearMonth와 id에 해당하는 데이터 조회

      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }

      console.log('data', data);

      res.status(200).json(data); // MongoDB에 저장된 데이터를 그대로 반환
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  }

  // POST 요청: 서버 시간을 기반으로 createdAt 추가
  else if (req.method === 'POST') {
    const { id } = req.body;
    const createdAt = new Date().toISOString(); // 서버의 현재 시간을 ISO 형식으로 저장

    try {
      await collection.updateOne(
        { yearMonth, id },
        { $push: { records: { createdAt } } },
        { upsert: true }
      );
      res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating data' });
    }
  }

  // 지원되지 않는 HTTP 메소드
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
