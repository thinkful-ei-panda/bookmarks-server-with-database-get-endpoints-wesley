
const knex = require('knex');

const app = require('../src/app');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Bookmarks Endpoints', () => {
  let db;

  before('make knex instance', () =>{
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db',db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean database', () => db('bookmarks').truncate());

  afterEach('clean database', () => db('bookmarks').truncate());

  context('If there is data', () => {
    const testData= [
      {id:1, title:'Bookmark 1',rating: 1,url: 'www.url1.com',description:'some description'},
      {id:2, title:'Bookmark 2',rating: 2,url: 'www.url2.com',description:'some description'},
      {id:3, title:'Bookmark 3',rating: 3,url: 'www.url3.com',description:'some description'},
      {id:4, title:'Bookmark 4',rating: 4,url: 'www.url4.com',description:'some description'},
      {id:5, title:'Bookmark 5',rating: 5,url: 'www.url5.com',description:'some description'},
    ];    
    
    beforeEach('insert data',() => {
      db
        .insert(testData)
        .into('bookmarks');
    });

    describe('GET /bookmarks', () => {
      it('should return all bookmarks', () => {
        return supertest(app)
          .get('/bookmarks')
          .expect(200,testData);
      });
    });

    describe('GET /bookmarks/:id', () => {
      it('should return bookmark matching id', () => {
        const firstId=1;
        return supertest(app)
          .get(`/bookmarks/${firstId}`)
          .expect(200)
          .then(result => {
            expect(result).to.eql(testData[firstId-1]);
          });
      });
    });
  });  
});

