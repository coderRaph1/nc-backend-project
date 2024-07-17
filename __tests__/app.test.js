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
describe('GET /api/articles/:article_id', () => {
    it('Returns a 200 status code and correct article when given correct article ID', () => {
      return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
      })

    })
    it('returns a 400 status when given an invalid article_id', () => {
      return request(app)
      .get('/api/articles/number-ten')
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Bad Request')
      })
    })
})
it('returns a status code 404 when given an invalid article ID number', () => {
  return request(app)
  .get('/api/articles/32')
  .expect(404)
  .then(({body}) => {
    expect(body.msg).toBe('Sorry article_id 32 Does Not Exist')
  })
}
)
})