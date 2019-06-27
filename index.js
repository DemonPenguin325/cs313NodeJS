const express = require('express')
const app = express()
const port = process.env.port || 80
var path = require('path')

//app.set('views', 'views')
//app.set('view engine', 'html')

const connectionString = process.env.DATABASE_URL || "postgres://dqkmfntwjboyjq:122d20c56bc748018b22c63514e8cf5ab9f51b4b2de30f5d081835c24793e073@ec2-54-83-1-101.compute-1.amazonaws.com:5432/dpi95ggndm6du?ssl=true"

const { Pool } = require('pg')
const pool = new Pool({connectionString: connectionString})

// App routing
app.use(express.static('public'))

app.get('/form', (req, res) => res.sendFile(path.join(__dirname + '/views/index.html')))
app.get('/person/:id', getPerson)
app.get('/parents/:id', getParents)
app.get('/children/:id', getChildren)


app.listen(port, () => console.log('App listening on port' + port))

// Logic

function getPerson(req, res){
// sql test
var sql = "SELECT * FROM person WHERE person_id = $1"
pool.query(sql, [req.params.id], function(err, result) {
    // If an error occurred...
    if (err) {
        console.log("Error in query: ")
        console.log(err);
    }

    // Log this to the console for debugging purposes.
    //console.log("Back from DB with result:");
    //console.log(result.rows);
    res.send(result.rows[0]);
});
}

function getParents(req, res){

}

function getChildren(req, res){
    
}