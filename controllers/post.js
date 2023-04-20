import { Post } from '../models/post.js';

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
  const { content, imageUrl } = req.body;

  if (!imageUrl) {
    return;
  }

  Post.create({
    content: content,
    imageUrl: imageUrl,
    creator: { name: 'Lucho' },
  })
    .then((post) => {
      if (!post) {
        const error = new Error('Something went wrong!!');
        error.statusCode = 422;
        throw error;
      }
      res.status(201).json({
        message: 'Post created!',
        post: post,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const editPost = (req, res, next) => {
  const postId = req.params.postId;
  const { content, imageUrl } = req.body;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('This posts not exits!');
        error.statusCode = 422;
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
  Post.findByIdAndRemove(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('This posts not exits!');
        error.statusCode = 422;
        throw error;
      }
      res.status(200).json({
        message: 'Post deleted successfully!',
        post: post,
      });
    })
    .catch((err) => {
      next(err);
    });
};
