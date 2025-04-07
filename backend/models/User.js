import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  avatar: {
    data: Buffer,
    contentType: String,
  },
  language: {
    type: String,
    enum: ['en', 'ua', 'pl', 'de', 'es', 'fr', 'it', 'pt', 'tr', 'zh', 'ja', 'ko', 'sv', 'ar'],
    default: 'en',
  },
}, { timestamps: true });




export const User = mongoose.model('User', userSchema);
