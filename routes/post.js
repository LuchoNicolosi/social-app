import { Router } from 'express';
import {
  createPost,
  getPosts,
  editPost,
  deletePost,
  getPost,
} from '../controllers/post.js';

import { body } from 'express-validator';

const router = Router();

router.get('/posts', getPosts).get('/post/:postId', getPost);
router.post(
  '/post',
  [
    body('content')
      .isLength({ min: 5 })
      .not()
      .isEmpty()
      .withMessage('Please enter a valid content'),
  ],
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
  ],
  editPost
);
router.delete('/post/:postId', deletePost);

export default router;
