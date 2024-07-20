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

describe('Error handler for incorrect endpoints', () => {
  it('will handle error for incorrect endpoints', () => {
    return request(app)
    .get('/api/dogs')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Sorry Endpoint Not Found')
    })
  })
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
describe('GET /api/articles', () => {
  it('returns the contents from the article table with all the correct properties with dates in descending order', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response) => {
    expect(Array.isArray(response.body.articles)).toBe(true);
    response.body.articles.forEach(article => {
    expect(article).toHaveProperty('author');
    expect(article).toHaveProperty('title');
    expect(article).toHaveProperty('article_id');
    expect(article).toHaveProperty('topic');
    expect(article).toHaveProperty('created_at');
    expect(article).toHaveProperty('votes');
    expect(article).toHaveProperty('article_img_url');
    expect(article).toHaveProperty('comment_count');
    expect(article).not.toHaveProperty('body')
})
const dates = response.body.articles.map(article => new Date(article.created_at).getTime());
for (let i = 1; i < dates.length; i++) {
  expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
}
        })
  })
})

describe('GET /api/articles/:article_id/comments', () => {
  it('returns commments when passed a specific article_id', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then((response) => {
      expect(response.body.comments.length).toBeGreaterThan(0)
      response.body.comments.forEach((comment) => {
    expect(comment).toHaveProperty('comment_id',expect.any(Number))
    expect(comment).toHaveProperty('votes',expect.any(Number))
    expect(comment).toHaveProperty('created_at',expect.any(String))
    expect(comment).toHaveProperty('author',expect.any(String))
    expect(comment).toHaveProperty('body',expect.any(String))
    expect(comment).toHaveProperty('article_id')
      })
    expect(response.body.comments).toBeSortedBy('created_at', {descending: true})      
    })
  })
  it('200: article with no commments', () => {
    return request(app)
    .get('/api/articles/2/comments')
    .expect(200)
    .then((response) => {
    expect(response.body.comments).toEqual([])
    })
  }
  )
  it('returns a 400 when given an invalid article_id', () => {
    return request(app)
    .get('/api/articles/dogs/comments')
    .expect(400)
    .then(({body}) => {
    expect(body.msg).toBe('Bad Request')
      })
  })

  it('returns a status code 404 when given a valid article ID number that does not exist', () => {
    return request(app)
    .get('/api/articles/32/comments')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Sorry article_id 32 Does Not Exist')
    })
  })
})

describe('POST: /api/articles/:article_id/comments', () => {
  it('201: responds with an extra comment added to the correct article_id', () => {

    return request(app)
    .post('/api/articles/4/comments')
    .send({ username: 'butter_bridge',
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!" })
    .expect(201)
    .then((response) => {
      expect(response.body.comment).toEqual({
        
        comment_id: 19,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: expect.any(Number),
        author: "butter_bridge",
        article_id: 4,
        created_at:expect.any(String)
      })
    })
})
it('returns a 400 status code when the username or body does not have an input', () => {
  return request(app)
  .post('/api/articles/4/comments')
  .send({ body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"})
  .expect(400)
  .then(({body}) => {
    expect(body.msg).toBe('Bad Request')
  })
})
it('returns a 400 status code when the article_id provided is invalid', () => {
    return request(app)
    .post('/api/articles/number-four/comments')
    .send({ username: 'butter_bridge',
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"})
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('Bad Request')
    })
  })
  it('returns a 404 status code when the article_id is valid but does not exist', () => {
    return request(app)
    .post('/api/articles/321/comments')
    .send({ username: 'butter_bridge',
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"})
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Sorry article_id 321 Does Not Exist')
    })
  })
  it('returns a 404 status message when passed a username that is not valid', () => {
    return request(app)
    .post('/api/articles/4/comments')
    .send({ username: 'coder_Raph',
        body: "Trust the process"})
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Username does not exist')

      //ADD TEST FOR CHECKING THE USERNAME IS TYPEOF STRING
    })
  })
})

describe('PATCH: /api/articles/:article_id', () => {
    it('returns the updated vote count for a given article_id', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({body}) => {
          expect(body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 101,
            article_img_url:expect.any(String)
          })
        })
      })
      it('returns with 400 status code when inc_votes does not have an input', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({})
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad Request")
        })
      })
      it('responds with 404 status code when article_id does not exist', () => {
        return request(app)
        .patch('/api/articles/613')
        .send({inc_votes: 1})
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe('Sorry article_id 613 Does Not Exist')
        })
      })
      it('returns a 400 status code when the article_id provided is invalid', () => {
        return request(app)
        .patch('/api/articles/number-six')
        .send({inc_votes: 1})
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad Request")
        })
      })
}
)
describe('DELETE: /api/comments/:comment_id', () => {
  it('responds with a 204 status code when when comment has been deleted', () => {
    return request(app)
    .delete('/api/comments/1')
    .expect(204)
  })
  it('returns a 404 status code when comment_id does not exist',
    () => {
      return request(app)
      .delete('/api/comments/6000')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('Not Found')
      })
    }
  )
  // it('returns a 400 status code when comment_id is invalid', () => {
  //   return request(app)
  //   .delete('/api/comments/number-ten')
  //   .expect(400)
  //   .then((body) => {
  //     expect(body.msg).toBe('Bad Request')
  //   })
  // })
})

describe('GET: /api/users', () => {
  it('returns a 200 status code and responds with an array of user objects', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({body}) => {
      expect(body.users).toHaveLength(4)
      

    const correctKeys = ["username", "name", "avatar_url"]
    
    body.users.forEach((user) => {
      expect(Object.keys(user)).toHaveLength(3)

    correctKeys.forEach((key) => {
      expect(typeof user[key]).toBe("string")})
  })
  })
  })
})