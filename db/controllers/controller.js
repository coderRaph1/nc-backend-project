const {getTopicsModel, fetchArticleById, fetchArticles, fetchComments, checkArticleExist, addCommentToArticle
} = require('../models/model')



exports.getTopicsController = (request, response) => {
    getTopicsModel()
    .then((topics) => {
      response.status(200).send({topics})
    })
}

exports.getArticleById = (request, response, next) => {
  const {article_id} = request.params
  fetchArticleById(article_id)
  .then((article) => {
    response.status(200).send({article})
  }).catch((err) => {
    next(err)
  })
}

exports.getArticles = (request, response, next) => {
  fetchArticles()
  .then((articles) => {
    response.status(200).send({articles})
  })
  .catch((err) => {
    next(err)
  })
}

exports.getComments = (request, response, next) => {
  const {article_id} = request.params
  checkArticleExist(article_id)
  .then(() => {
    return fetchComments(article_id)
     
  })
  .then((comments) => {
    response.status(200).send({comments})
  })
  .catch((err) => {
    next(err)
  })
}

exports.addComments = (request, response, next) => {

  const {article_id} = request.params

  const {username, body} = request.body
  
   addCommentToArticle(article_id, username, body)
 
  .then((comment) => {
    response.status(201).send({comment})
  }).catch((err) => {
    next(err)
  })
}

