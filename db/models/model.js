const db = require('../connection')

exports.getTopicsModel = () => {
    return db.query('SELECT * FROM topics')
    .then(results  => results.rows)
}

exports.fetchArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `Sorry article_id ${article_id} Does Not Exist`
            })
        }
      return rows[0]
    })
}

exports.fetchArticles = () => {
  
  
  

  return db.query( ` SELECT 
      articles.article_id, 
      articles.author, 
      articles.title, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      COUNT(comments.comment_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY 
      articles.article_id, 
      articles.author, 
      articles.title, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url
    ORDER BY articles.created_at DESC;` )
  .then(({rows}) => {
    return rows
  })
}

function checkTopicExists(topic){
  return db.query('SELECT * FROM topics WHERE topics.slug = $1', [topic]).then((result) => {
    if (result.rows.length === 0){
      return false
    } 
    return true
  }) 
}

exports.fetchComments = (article_id) => {
    return db.query('SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [article_id])
    .then(({rows}) => {
      return rows
    })
}

exports.checkArticleExist = (article_id) => {
return db.query('SELECT * from articles WHERE article_id = $1',[article_id])
.then(({rows}) => {
  if(rows.length === 0){
    return Promise.reject(
        {status: 404,
        msg: `Sorry article_id ${article_id} Does Not Exist`
    })
  }
 
    return rows
})
}

exports.addCommentToArticle = (article_id, username, body) => {

    return this.fetchArticleById(article_id)

    .then(() => {
        return db.query('INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;', [article_id, username, body])
    })
    .then(({rows}) => {

      return rows[0]
    })

}

exports.incrementVotes = (article_id, inc_votes) => {
    return this.fetchArticleById(article_id)

    .then(() => {
      return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *', [inc_votes, article_id])
      
    })
        .then(({rows}) => {
            return rows[0]
        })
}

exports.fetchDeletedComments = (comment_id) => {

  return this.checkCommentExists(comment_id)

  .then((result) => {

    if(!result){

      return Promise.reject({
        status: 404,
        msg: 'Not Found'})
    }
    else{
        return db.query('DELETE FROM comments WHERE comment_id = $1', [comment_id])}
      })   
      .then(({rows}) => {
        return rows
  })
}

exports.checkCommentExists = (comment_id) => {
  return db.query('SELECT * FROM comments WHERE comment_id = $1',[comment_id])
  .then(({rows}) => {
      return rows.length === 1
  }).catch((err) => {
    next(err)
  })
}

exports.fetchUsers = () => {

  return db.query("SELECT * FROM users")
  .then(({rows}) => {
    return rows
  }).catch((err) => {
    next(err)
  })
}

exports.checkIfCommentExists = (comment_id) => {
  return db.query("SELECT * FROM comments WHERE comment_id=$1",[comment_id])
  .then(({rows})=>{
    return rows.length > 0
  })
}



// exports.fetchArticles = (sort_by, order, topic) => {
//   //create OG string

//   let queryStr = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`

//   //check that topic exists (through a function)
// const queryValues = []
// const promiseArray = []
// const validSortBy = ['title','topic','author','created_at', 'body', 'article_img_url']


// if (topic){
//     //update the OG SQL 
//     queryStr += ` WHERE articles.topic = $1`
//     queryValues.push(topic)
//     promiseArray.push(checkTopicExists(topic))   

//   }
// queryStr += ` GROUP BY articles.article_id`




// const articlesQuery = db.query (queryStr, queryValues)
// promiseArray.push(articlesQuery)
// return Promise.all(promiseArray).then((result) => {
//   return result[1].rows
// })

// //Error handling for if there is no topic

//   //create greenlist for suitable sort_by
//   //check if sort_by is greenlisted
//   //update the OG(1) SQL 

//   //create greenlist for suitable order
//   //check if order is greenlisted
//   //update the OG(2) SQL 
// }