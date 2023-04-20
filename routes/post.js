import { Router } from 'express';
import {
  createPost,
  getPosts,
  editPost,
  deletePost,
  getPost,
} from '../controllers/post.js';

const router = Router();

router.get('/posts', getPosts).get('/post/:postId', getPost);
router.post('/post', createPost);
router.put('/post/:postId', editPost);
router.delete('/post/:postId', deletePost);

export default router;
