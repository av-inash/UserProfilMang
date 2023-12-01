const express = require('express');
const router = express.Router();
const {    registerUser,
    loginUser,
    logoutUser,
    createPost,
    getAllPosts,
    addComment,
    getPostComments
    } = require('./controller'); 

router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.post('/logoutUser', logoutUser);
router.post('/createPost',  createPost);
router.get('/getAllPosts',  getAllPosts); 
router.post('/addComment',  addComment); 
router.get('/getPostComments',  getPostComments); 
module.exports = router;
