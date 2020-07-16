module.exports = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEPLOY_URL:'http://localhost:',
  DB_URL: process.env.DB_URL || 'postgresql://dunder_mifflin@localhost/bookmarks'
};