import { Router } from 'express';
import { login, signup } from '../controllers/auth.js';
import { body } from 'express-validator';
import { User } from '../models/user.js';

const router = Router();

router.post('/login', login);

router.post(
  '/signup',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email!')
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('Email adress already exists!');
          }
        });
      }),
    body('name').isLength({ min: 3, max: 10 }).trim().not().isEmpty(),
    body('password').trim().isLength({ min: 5 }),
    body('userName')
      .trim()
      .isLength({ min: 5, max: 15 })
      .custom((value, { req }) => {
        return User.findOne({ userName: value }).then((user) => {
          if (user) {
            return Promise.reject('Username already exists!');
          }
        });
      }),
  ],
  signup
);

export default router;
