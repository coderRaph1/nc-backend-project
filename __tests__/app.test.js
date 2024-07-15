const request = require('supertest')
const app = require('../db/app.js')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data')

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
    // console.log(res.body)
    expect(res.body).toEqual([
        { slug: 'mitch', description: 'The man, the Mitch, the legend' },
        { slug: 'cats', description: 'Not dogs' },
        { slug: 'paper', description: 'what books are made of' }
      ])
   })
  }
  )
})