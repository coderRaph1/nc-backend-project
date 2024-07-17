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
