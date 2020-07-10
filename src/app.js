require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {v4: uuid} = require('uuid');

const {NODE_ENV,PORT,DEPLOY_URL} = require('./config');
const logger = require ('./logger');
const bookmarks = require ('./BOOKMARKS');

const app = express();

const morgOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morgOption));
app.use(cors());
app.use(helmet());

app.use(function validateApiToken(req,res,next){
  const BearerToken=req.get('Authorization');
  const API_TOKEN = process.env.API_TOKEN;
  if(!API_TOKEN || API_TOKEN!==BearerToken.split(' ')[1]){
    logger.error(`Unauthorized request to path: ${req.path}`);
    res.status(401).json({error:'Unauthorized user'});
  }
  next();
});

app.get('/bookmarks', (req,res) => {
  res.status(200).send(bookmarks);
});

app.get('/bookmarks/:id', express.json(), (req,res) => {
  const {id} = req.params;
  const response = bookmarks.find(bookmark=> bookmark.id == id);

  console.log(response);
  if(!response){
    logger.error(`Bookmark with id matching ${id} not found`);
    return res.status(404).json({error: `Bookmark with id matching ${id} not found`});
  }
  res.json(response);
});

app.post('/bookmarks', express.json(), (req,res) => {
  const {
    title,
    rating,
    url,
    description,
  } = req.body;

  if(!title || !url || !description){
    logger.error('Missing form fields');
    return res.status(404).json({error: 'Missing required form fields'});
  }

  const newBookmark= {
    id:uuid(),
    title,
    rating,
    url,
    description,
  };

  bookmarks.push(newBookmark);

  res.status(201).location(`${DEPLOY_URL}${PORT}/bookmark/${newBookmark.id}`).json({newBookmark});

});





app.use(function errorHandler(error,req,res,next){ //eslint-disable-line
  let response;
  if(NODE_ENV === 'production') {
    response = {error: {message: 'server error'}};
  }else{
    console.log(error);
    response = {message: error.message, error};
  }
  res.status(400).json(response);
});

module.exports = app;