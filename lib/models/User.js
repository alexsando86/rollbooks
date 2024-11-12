import mongoose, { Schema, model, models } from 'mongoose';

// Mongoose 연결 설정
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// schema
const userSchema = new Schema({
  employeeId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  access: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  startWorkAt: { type: Date },
  getOffAt: { type: Date },
  status: { type: String },
});

if (mongoose.models?.User) {
  console.log('User 모델이 이미 정의되어 있습니다.');
} else {
  console.log('User 모델을 새로 정의합니다.');
}

// 모델이 이미 정의되어 있는지 확인하고, 정의되어 있지 않으면 새로운 모델을 정의합니다.
const User = models && (models.User || model('User', userSchema));

export default User;
export { connectToDatabase };
