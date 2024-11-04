import { Schema, model, models } from 'mongoose';

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

const User = models.User || model('User', userSchema);

export default User;
