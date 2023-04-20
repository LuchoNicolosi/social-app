import { Post } from '../models/post.js';

export const getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res
        .status(200)
        .json({ message: 'Post fetched succsessfully!', posts: posts });
    })
    .catch((err) => {
      console.log(err);
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
      console.log(err);
    });
};

export const deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findByIdAndRemove(postId)
    .then((post) => {
      res.status(200).json({
        message: 'Post deleted successfully!',
        post: post,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
