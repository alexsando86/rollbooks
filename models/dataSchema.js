// models/Data.js
import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now, // 기본값으로 서버 시간을 설정
  },
  // 추가적인 필드가 필요한 경우 여기에 정의할 수 있습니다.
});

const dataSchema = new mongoose.Schema({
  yearMonth: {
    type: String,
    // required: true, // 필수 항목으로 설정
  },
  id: {
    type: mongoose.Schema.Types.Mixed, // 문자열 또는 숫자 모두를 허용,
    required: true, // 필수 항목으로 설정
  },
  records: [recordSchema], // records 필드는 recordSchema를 배열로 포함
});

const Data = mongoose.models.Data || mongoose.model('Data', dataSchema);

export default Data;
