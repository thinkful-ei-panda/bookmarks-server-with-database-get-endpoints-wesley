const BookmarksService = {
  getAllBookmarks(db){
    return db
      .select()
      .from('bookmarks');
  },

  getById(db,id){
    return db('bookmarks')
      .select()
      .where({ id })
      .first();
  },

  insertBookmark(db,newBookmark){
    return db
      .insert(newBookmark)
      .into('bookmarks')
      .returning('*')
      .then(rows => rows[0]);
  },

  deleteBookmark(db,id){
    return db('bookmarks')
      .delete()
      .where({ id });
  },

  updateBookmark(db,id,newBookmarkFields){
    return db('bookmarks')
      .update(newBookmarkFields)
      .where({ id });
  }
};

module.exports = BookmarksService;