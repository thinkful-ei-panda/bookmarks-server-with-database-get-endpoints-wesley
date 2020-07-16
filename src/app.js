require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const BookmarksRoute = require('./bookmarks-route');

const {NODE_ENV} = require('./config');
const logger = require ('./logger');

const app = express();

const morgOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morgOption));
app.use(cors());
app.use(helmet());

// app.use(function validateApiToken(req,res,next){
//   const BearerToken=req.get('Authorization');
//   const API_TOKEN = process.env.API_TOKEN;
//   if(!API_TOKEN || API_TOKEN!==BearerToken.split(' ')[1]){
//     logger.error(`Unauthorized request to path: ${req.path}`);
//     res.status(401).json({error:'Unauthorized user'});
//   }
//   next();
// });

app.use('/bookmarks', BookmarksRoute);

app.use(function errorHandler(error,req,res,next){ //eslint-disable-line
  let response;
  if(NODE_ENV === 'production') {
    response = {error: {message: 'server error'}};
  }else{
    response = {message: error.message, error};
  }
  res.status(500).json(response);
});

module.exports = app;