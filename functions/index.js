

const functions = require('firebase-functions');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())

const  fireAuth = require('./validations/fireAuth');
const { signup, login, getAuthUser } = require('./controllers/auth');
const { posts, newPost, getPost } = require('./controllers/posts');
const { getComments, newComment } = require('./controllers/coments');

app.post('/signup', signup);
app.post('/login', login);
app.get('/user',fireAuth, getAuthUser);

app.get('/posts', posts);
app.post('/new/post',fireAuth, newPost);
app.get('/post/:postId', getPost);

app.get('/comments', getComments);
app.post('/new/comment/:postId',fireAuth, newComment);








exports.api = functions.https.onRequest(app);
