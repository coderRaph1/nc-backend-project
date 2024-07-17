const {getTopicsModel, fetchArticleById} = require('../models/model')



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

