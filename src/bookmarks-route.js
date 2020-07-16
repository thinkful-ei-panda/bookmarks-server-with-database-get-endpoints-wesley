const express = require('express');
const logger = require('./logger');
const BookmarksRouter = express.Router();
const bookmarks = require('./BOOKMARKS');
const {PORT,DEPLOY_URL} = require('./config');
const {v4: uuid} = require('uuid');
const BookmarksService = require('./bookmarks-service');

BookmarksRouter
  .route('/')
  .get((req,res,next) => {
    const db = req.app.get('db');
    BookmarksService.getAllBookmarks(db)
      .then(bookmarks => {
        res.json(bookmarks);
      })
      .catch(next);
  })
  .post(express.json(), (req,res) => {
    const {
      title,
      rating,
      url,
      description,
    } = req.body;
    
    if(!title || !url || !description){
      logger.error('Missing form fields');
      return res
        .status(404)
        .json({error: 'Missing required form fields'});
    }
    
    const newBookmark= {
      id:uuid(),
      title,
      rating,
      url,
      description,
    };
    
    bookmarks.push(newBookmark);
    
    res.status(201)
      .location(`${DEPLOY_URL}${PORT}/bookmark/${newBookmark.id}`)
      .json({newBookmark});
    
  });


BookmarksRouter
  .route('/:id')
  .get(express.json(), (req,res) => {
    const {id} = req.params;
    const db = req.app.get('db');

    BookmarksService.getById(db,id)
      .then(bookmark => {
        if(!bookmark){
          logger.error(`Bookmark with id matching ${id} not found`);
          return res.status(404).json({error: `Bookmark with id matching ${id} not found`});
        }
        res.json(bookmark);
      });
  })
  .delete(express.json(), (req, res) => {
  
    const {id} = req.params;
    const bookmarkIndex = bookmarks.findIndex(bkm => bkm.id == id );
    if(bookmarkIndex === -1){
      logger.error(`Bookmark with id ${id} was not found`);
      return res.status(404).send('Bookmark not found');
    }
  
    bookmarks.splice(bookmarkIndex, 1);
  
    logger.info(`Bookmark with id ${id} was successfully deleted`);
    res.status(204).end();
  });

module.exports = BookmarksRouter;