import { validationResult } from 'express-validator';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';

export const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, name, imageUrl, userName, password } = req.body;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      if (!hashedPassword) {
        const error = new Error('Something went wrong!!');
        error.statusCode = 500;
        throw error;
      }
      return User.create({
        email: email,
        name: name,
        userName: userName,
        imageUrl: imageUrl,
        password: hashedPassword,
      });
    })
    .then((user) => {
      if (!user) {
        const error = new Error('Something went wrong!!');
        error.statusCode = 500;
        throw error;
      }
      res.status(200).json({
        message: 'Signup successfully!!!',
        userId: user._id,
      });
    })
    .catch((err) => next(err));
};
