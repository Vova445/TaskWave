import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';

export const getProfile = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Немає токену доступу' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    res.status(200).json({
        name: user.name,
        email: user.email,
        phone: user.phone,
        id: user._id,
        avatar: user.avatar?.data
          ? `data:${user.avatar.contentType};base64,${user.avatar.data.toString('base64')}`
          : null,
      });
          
  } catch (err) {
    res.status(401).json({ message: 'Недійсний токен' });
  }
};

export const updateName = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Немає токену доступу' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: "Ім'я не може бути порожнім" });
    }

    user.name = name.trim();
    await user.save();

    res.status(200).json({ message: 'Ім’я оновлено успішно', name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
};



export const changePassword = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Немає токену доступу' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
  
      const { oldPassword, newPassword } = req.body;
  
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Введіть старий і новий пароль' });
      }
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Неправильний старий пароль' });
      }
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
  
      res.status(200).json({ message: 'Пароль успішно змінено' });
    } catch (err) {
      res.status(401).json({ message: 'Недійсний токен' });
    }
  };


  const storage = multer.memoryStorage();

  const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
      const allowed = ['image/jpeg', 'image/png'];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Дозволені лише JPG та PNG'));
      }
    },
  }).single('avatar');
  
  export const uploadAvatar = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Немає токену' });
  
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Недійсний токен' });
  
      upload(req, res, async function (err) {
        if (err) return res.status(400).json({ message: err.message });
  
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
  
        user.avatar = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
  
        await user.save();
        res.status(200).json({ message: 'Аватар оновлено успішно' });
      });
    });
  };



  export const deleteAvatar = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Немає токену' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
  
      user.avatar = undefined;
      await user.save();
      res.status(200).json({ message: 'Аватар видалено' });
    } catch (err) {
      res.status(401).json({ message: 'Недійсний токен' });
    }
  };
  

  export const updateLanguage = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Немає токену доступу' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ message: 'Користувача не знайдено' });
      }
  
      const { language } = req.body;
  
      const allowedLanguages = [
        'en', 'ua', 'pl', 'de', 'es', 'fr', 'it', 'pt', 'tr', 'zh', 'ja', 'ko', 'sv', 'ar'
      ];
  
      if (!allowedLanguages.includes(language)) {
        return res.status(400).json({ message: 'Invalid language code' });
      }
  
      user.language = language;
      await user.save();
  
      res.status(200).json({ message: 'Language updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Помилка сервера' });
    }
  };
  