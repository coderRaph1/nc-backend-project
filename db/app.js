const express = require("express");
const app = express();
const { getTopicsController,
        getArticleById } = require("./controllers/controller");
const { getApiController } = require("./controllers/get-api-controller")


app.get("/api/topics", getTopicsController);

app.get("/api", getApiController);

app.get("/api/articles/:article_id", getArticleById)

app.use((err, request, response, next) => {
    if(err.code === '22P02'){
        response.status(400).send({msg: 'Bad Request'})
    }else {
        next(err)
    }
  
})

app.use((err, request, response, next) => {
    console.log(err)
    if(err.status && err.msg){
        response.status(err.status).send({ msg: err.msg })
    }else {
        next(err)
    }
  
})

app.all('*', (request, response) => {
  response.status(404).send({msg: 'Endpoint Not Found'})
})
module.exports = app;
