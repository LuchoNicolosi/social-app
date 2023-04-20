import { validationResult } from 'express-validator';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

export const login = (req, res, next) => {
  const { userName, password } = req.body;
  let loadUser;
  User.findOne({ userName: userName })
    .then((user) => {
      if (!user) {
        const error = new Error('Username does not exist!');
        error.statusCode = 422;
        throw error;
      }
      loadUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Incorrect password!');
        error.statusCode = 422;
        throw error;
      }

      const token = jwt.sign(
        {
          userName: userName,
          user: loadUser._id.toString(),
        },
        process.env.JWT_SECRET
      );

      res.status(201).json({ message: 'Login successfully', token: token });
    })
    .catch((err) => next(err));
};
