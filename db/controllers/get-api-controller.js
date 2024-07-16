const endpoints = require('../endpoints.json')

const getApiController = (request, response) => { 
    response.status(200).send({ endpoints }) 
}

module.exports = { getApiController }