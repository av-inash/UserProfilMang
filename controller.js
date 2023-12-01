// controller.js
const {User,Post,Comment} = require('./model');
const { user } = require('./validation'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const NodeGeocoder = require('node-geocoder');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
  
    if ([username, email, password].some((field) => !field || field.trim() === "")) {
        return res.status(400).json({ error: 'all fields are required' });
    }
  
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        return res.status(409).json({ error: 'email already exist' });
    }
  
    const user = await User.create({
      email,
      password,
      username,
    });
  
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    console.log("createdUser=====",createdUser)
  
    if (!createdUser) {
        return res.status(400).json({ error: 'something went wrong' });
    }
    
   return res.status(200).json({ message: 'created user' });
  };

  const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if ([email, password].some((field) => !field || field.trim() === "")) {
      return res.status(400).json({ error: 'email and password are required' });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
    //   const isPasswordValid = await user.isPasswordCorrect(password);
    //   if (!isPasswordValid) {
    //     return res.status(401).json({ error: 'Invalid email or password' });
    //   }
  
      const userWithoutSensitiveInfo = user.toObject();
      delete userWithoutSensitiveInfo.password;
      delete userWithoutSensitiveInfo.refreshToken;
  
      // Assuming you have an access token expiration set in .env
      const secretKey = 'av12';
      const accessTokenExpirationTimeInSeconds = 60 * 60;
      const accessToken = jwt.sign(
        { _id: user._id, email: user.email, username: user.username },
        secretKey,
        { expiresIn:accessTokenExpirationTimeInSeconds  }
      );
  
      // Set the refresh token as a cookie in the response
      const refreshToken = jwt.sign(
        { _id: user._id },
        'yourRefreshTokenSecretKey',  // Replace with your actual refresh token secret key
        { expiresIn: '7d' }  // Replace with your actual refresh token expiry
      );
  
      // Set the refresh token as a cookie in the response
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // Other cookie options such as secure, domain, path, etc.
      });
  
      return res.status(200).json({
        ...userWithoutSensitiveInfo,
        accessToken,
        message: "User login successful",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  const logoutUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      throw new ApiError(400, "Refresh token is required");
    }
  
    try {
      // Replace 'yourRefreshTokenSecretKey' with your actual refresh token secret key
      const decodedToken = jwt.verify(refreshToken, 'yourRefreshTokenSecretKey');
  
      // Call the function to mark the refresh token as revoked in the database
      await markTokenAsRevoked(decodedToken._id, refreshToken);
  
      res.clearCookie("refreshToken");
  
      return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
    } catch (error) {
      throw new ApiError(401, "Invalid refresh token");
    }
  };
  
  const markTokenAsRevoked = async (userId, refreshToken) => {
    // Using Mongoose to update the user's record
    await User.updateOne({ _id: userId }, { $pull: { refreshTokens: refreshToken } });
  };

  const createPost = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.body.userId;
  
    const post = await Post.create({ title, content, user: userId });
  
    
    return res.status(201).json({ post, message: 'Post created successfully' });
  };

  const getAllPosts = async (req, res) => {
    const posts = await Post.find().populate("user", "-password -refreshToken");
  
    return res.status(201).json({ posts, message: 'Post retrived successfully' });
  };

  const addComment = async (req, res) => {
    const { postId, content } = req.body;
    const userId = req.body.userId;
  
    const comment = await Comment.create({ content, user: userId, post: postId });
  
    return res.status(201).json({ comment, message: 'comment added successfully' });
};
const getPostComments = async (req, res) => {
    const postId = req.query.postId;
    const comments = await Comment.find({ post: postId }).populate("user", "-password -refreshToken");
  
    return res.status(201).json({ comments, message: 'comments retrived successfully' });
  };
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    createPost,
    getAllPosts,
    addComment,
    getPostComments
    
};
