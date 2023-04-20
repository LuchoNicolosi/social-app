import jwt from 'jsonwebtoken';
export const isAuth = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authorized.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader;
  let tokenVerify;

  try {
    tokenVerify = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (!tokenVerify) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  req.userId = tokenVerify.userId;
  next();
};
