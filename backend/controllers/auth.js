import { validationResult } from 'express-validator';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const { email, name, userName, password } = req.body;
  let imageUrl = req.file;
  if (req.file) {
    imageUrl = req.file.path.replace('\\', '/');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) {
      const error = new Error('Something went wrong!!');
      error.statusCode = 500;
      throw error;
    }
    const user = new User({
      email: email,
      name: name,
      userName: userName,
      imageUrl: imageUrl,
      password: hashedPassword,
    });

    if (!user) {
      const error = new Error('Something went wrong!!');
      error.statusCode = 500;
      throw error;
    }
    const result = await user.save();

    res.status(200).json({
      message: 'Signup successfully!!!',
      userId: result._id,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { userName, password } = req.body;
  let loadUser;

  try {
    const user = await User.findOne({ userName: userName });
    if (!user) {
      const error = new Error('Username does not exist!');
      error.statusCode = 422;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error('Incorrect password!');
      error.statusCode = 422;
      throw error;
    }

    const token = jwt.sign(
      {
        userName: userName,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      message: 'Login successfully',
      token: token,
      userId: user._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};
