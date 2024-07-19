const express = require("express");
const app = express();
const { getTopicsController,
        getArticleById,
        getArticles,
        getComments,
        addComments } = require("./controllers/controller");
const { getApiController } = require("./controllers/get-api-controller")

app.use(express.json())

app.get("/api/topics", getTopicsController);

app.get("/api", getApiController);

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get('/api/articles/:article_id/comments', getComments)

app.post('/api/articles/:article_id/comments', addComments)


//ERROR HANDLERS

app.use((err, request, response, next) => {
    if(err.code === '22P02' || err.code === '23502'){
        response.status(400).send({msg: 'Bad Request'})
    }
    else if(err.code === '23503'){
        response.status(404).send({msg: 'Username does not exist'})
    }
    else {
        next(err)
    }
  
})

app.use((err, request, response, next) => {
    if(err.status && err.msg){
        response.status(err.status).send({ msg: err.msg })
    }else {
        next(err)
    }
  
})

app.all('*', (request, response) => {
  response.status(404).send({msg: 'Sorry Endpoint Not Found'})
})
module.exports = app;
