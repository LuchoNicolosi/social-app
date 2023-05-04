import { validationResult } from 'express-validator';
import { Post } from '../models/post.js';
import { User } from '../models/user.js';
import { clearImage } from '../util/clearImage.js';
import { SocketServer as io } from '../socket.js';
import cloudinary from '../util/cloudinary.js';

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('creator');
    if (!posts) {
      const error = new Error('Could not fetch the posts!!!');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Posts fetched succsessfully!',
      posts: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId).populate('creator');
    if (!post) {
      const error = new Error('Post not found!!');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: 'Post fetched succsessfully!!',
      post: post,
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const content = req.body.content;
  let imageUrl;
  if (req.file) {
    imageUrl = req.file.path;
  }

  let imageUploaded;

  try {
    if (imageUrl) {
      imageUploaded = await cloudinary.uploader.upload(imageUrl, {
        folder: 'social-posts/posts',
      });
    }

    const post = new Post({
      content: content,
      imageUrl: {
        public_id: imageUploaded?.public_id || null,
        url: imageUploaded?.secure_url || null,
      },
      creator: req.userId,
    });

    if (!post) {
      const error = new Error('Something went wrong.');
      error.statusCode = 404;
      throw error;
    }
    const postCreated = await post.save();
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error('Something went wrong!');
      error.statusCode = 422;
      throw error;
    }

    user.posts.push(post);

    const result = await user.save();

    io.getIo().emit('posts', {
      action: 'create',
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
    });

    res.status(201).json({
      message: 'Post created!',
      post: postCreated,
      creator: {
        _id: result._id,
        name: result.userName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const editPost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const content = req.body.content;
  let imageUrl;
  if (req.file) {
    imageUrl = req.file.path;
  }
  let imageUploaded;
  try {
    if (imageUrl) {
      imageUploaded = await cloudinary.uploader.upload(imageUrl, {
        folder: 'social-posts/posts',
      });
    }
    const post = await Post.findById(postId).populate('creator');
    if (!post) {
      const error = new Error('This posts not exits!');
      error.statusCode = 404;
      throw error;
    }

    if (post.creator._id.toString() !== req.userId) {
      const error = new Error('Not authorized.');
      error.statusCode = 403;
      throw error;
    }

    if (post.imageUrl.public_id && imageUploaded.public_id) {
      if (imageUploaded.public_id !== post.imageUrl.public_id) {
        await cloudinary.uploader.destroy(post.imageUrl.public_id);
      }
    }

    post.content = content;
    post.imageUrl = imageUploaded || post.imageUrl;

    const result = await post.save();

    io.getIo().emit('posts', {
      action: 'update',
      post: result,
    });

    res.status(200).json({
      message: 'Post edited successfully',
      post: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized.');
      error.statusCode = 403;
      throw error;
    }
    if (post.imageUrl.public_id) {
      await cloudinary.uploader.destroy(post.imageUrl.public_id);
    }

    const postDeleted = await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);

    user.posts.pull(postDeleted);
    await user.save();

    io.getIo().emit('posts', {
      action: 'delete',
      post: postId,
    });

    res.status(200).json({
      message: 'Post deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};
