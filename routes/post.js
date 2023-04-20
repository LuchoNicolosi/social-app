import { Router } from 'express';
import {
  createPost,
  getPosts,
  editPost,
  deletePost,
} from '../controllers/post.js';

const router = Router();

router.get('/posts', getPosts);
router.post('/post', createPost);
router.put('/post/:postId', editPost);
router.delete('/post/:postId', deletePost);

export default router;
