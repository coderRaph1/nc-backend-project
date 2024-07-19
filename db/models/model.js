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
    
    return db.query('SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC')
    .then(({rows}) => {
      return rows
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