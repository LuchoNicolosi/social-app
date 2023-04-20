import { Router } from 'express';
import postRoutes from './post.js';

const router = Router();

router.use('/home', postRoutes);

export default router;
