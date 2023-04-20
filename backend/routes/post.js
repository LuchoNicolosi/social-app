import { Router } from 'express';
import {
  createPost,
  getPosts,
  editPost,
  deletePost,
  getPost,
} from '../controllers/post.js';
import { body } from 'express-validator';
import { isAuth } from '../middlewares/isAuth.js';

const router = Router();

router.get('/posts', isAuth, getPosts);
router.get('/post/:postId', isAuth, getPost);
router.post(
  '/post',
  [
    body('content')
      .isLength({ min: 5 })
      .not()
      .isEmpty()
      .withMessage('Please enter a valid content'),
  ], isAuth,
  createPost
);
router.put(
  '/post/:postId',
  [
    body('content')
      .isLength({ min: 5 })
      .not()
      .isEmpty()
      .withMessage('Please enter a valid content'),
  ], isAuth,
  editPost
);
router.delete('/post/:postId', isAuth, deletePost);

export default router;
