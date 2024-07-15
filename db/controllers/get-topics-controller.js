const getTopicsModel = require('../models/get-topics-model')

exports.getTopicsController = (req, res, next) => {
    getTopicsModel()
    .then((topics) => {
      res.status(200).send(topics)
    })
    .catch((err) => {
      console.log(err)
    })
}