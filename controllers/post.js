import { validationResult } from 'express-validator';
import { Post } from '../models/post.js';
import { User } from '../models/user.js';

export const getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      if (!posts) {
        const error = new Error('Could not fetch the posts!!!');
        error.statusCode = 404;
        throw error;
      }
      res
        .status(200)
        .json({ message: 'Posts fetched succsessfully!', posts: posts });
    })
    .catch((err) => {
      next(err);
    });
};

export const getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Post not found!!');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: 'Post fetched succsessfully!!',
        post: post,
      });
    })
    .catch((err) => {
      next(err);
    });
};

export const createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { content, imageUrl } = req.body;
  let postUser;
  let creator;

  if (!imageUrl) {
    return;
  }

  Post.create({
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  })
    .then((post) => {
      if (!post) {
        const error = new Error('Something went wrong!!');
        error.statusCode = 422;
        throw error;
      }
      postUser = post;
      return User.findById(req.userId);
    })
    .then((user) => {
      if (!user) {
        const error = new Error('Something went wrong!');
        error.statusCode = 422;
        throw error;
      }
      creator = user;
      user.posts.push(postUser);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: 'Post created!',
        post: postUser,
        creator: {
          _id: creator._id,
          name: creator.name,
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const editPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const postId = req.params.postId;
  const { content, imageUrl } = req.body;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('This posts not exits!');
        error.statusCode = 422;
        throw error;
      }
      
      if (post.creator.toString() !== req.userId) {
        const error = new Error('Not authorized.');
        error.statusCode = 403;
        throw error;
      }

      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((post) => {
      res.status(200).json({
        message: 'Post edited successfully',
        post: post,
      });
    })
    .catch((err) => {
      next(err);
    });
};

export const deletePost = (req, res, next) => {
  const postId = req.params.postId;
  let postDeleted;

  Post.findById(postId)
    .then((post) => {
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
      return Post.findByIdAndRemove(postId);
    })

    .then((post) => {
      if (!post) {
        const error = new Error('This posts not exits!');
        error.statusCode = 422;
        throw error;
      }
      postDeleted = post;
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postDeleted);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({
        message: 'Post deleted successfully!',
        post: postDeleted,
      });
    })
    .catch((err) => {
      next(err);
    });
};
