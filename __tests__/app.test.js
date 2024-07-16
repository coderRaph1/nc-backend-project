const request = require('supertest')
const app = require('../db/app.js')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data')
const endpoints = require('../db/endpoints.json')

afterAll(()=>{
    return db.end()
})

beforeEach(() => {
  return seed(testData)
})

describe('GET /api/topics', () => {
  it('responds with all of the topics data', () => {
   return request(app)
   .get('/api/topics')
   .expect(200)
   .then((res) => {
    expect(res.body.topics).toEqual([
        { slug: 'mitch', description: 'The man, the Mitch, the legend' },
        { slug: 'cats', description: 'Not dogs' },
        { slug: 'paper', description: 'what books are made of' }
      ])
   })
  }
  )
})

describe('GET /api/', () => {
    it('responds wih all of the endpoints that are available', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then(({body}) => {
        expect(body.endpoints).toEqual(endpoints)
      })
    })
})