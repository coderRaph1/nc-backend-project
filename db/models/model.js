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
    console.log('hello')
    
    return db.query('SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC')
    .then(({rows}) => {
      return rows
    })
}
