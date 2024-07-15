const db = require('../connection')

function getTopicsModel(){
    return db.query('SELECT * FROM topics')
    .then(results  => results.rows)
}

module.exports = getTopicsModel