const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bcrypt = require('bcrypt')
var path = require('path')
var session = require('express-session')

app.use(express.urlencoded())
app.use(session({
    secret: 'funSecret',
    resave: false,
    saveUninitialized: true
}))

app.use(function(req, res, next){
    if (!req.session.user){
        req.session.user = "none";
    }
    next()
})

app.use(function(req, res, next){
    console.log("Recieved a request for " + req.url)
    next()
})

const connectionString = process.env.DATABASE_URL || "postgres://dqkmfntwjboyjq:122d20c56bc748018b22c63514e8cf5ab9f51b4b2de30f5d081835c24793e073@ec2-54-83-1-101.compute-1.amazonaws.com:5432/dpi95ggndm6du?ssl=true"

const { Pool } = require('pg')
const pool = new Pool({connectionString: connectionString})

// App routing
app.use(express.static('public'))

// Main project routing
app.get('/larp', (req, res) => res.sendFile(path.join(__dirname + '/views/larp.html')))
app.get('/resources/update.js', (req, res) => res.sendFile(path.join(__dirname + '/views/update.js')))
app.get('/resources/style.css', (req, res) => res.sendFile(path.join(__dirname + '/views/style.css')))
app.get('/data/:type/:amount', getData)
app.get('/login', (req, res) => res.sendFile(path.join(__dirname + '/views/login.html')))
app.post('/auth', login)
app.get('/edit', (req, res) => res.sendFile(path.join(__dirname + '/views/edit.html')))
app.get('/getEditInfo', getEditInfo)
app.post('/editInfo', updateDB)
app.post('/add', addToDB)
app.post('/delete', deleteFromDB)
// Team activity routing
//app.get('/week10/form', (req, res) => res.sendFile(path.join(__dirname + '/views/index.html')))
//app.get('/week10/person/:id', getPerson)
// Team activity 12
//app.post('/login', login)
/*
app.post('/logout', logout)
app.get('/getServerTime', time)
app.get('/setPass/:password', setPass)
app.get('/test', (req, res) => res.sendFile(path.join(__dirname + '/static/test.html')))
app.get('/test.js', (req, res) => res.sendFile(path.join(__dirname + '/static/test.js')))
*/
app.listen(port, () => console.log('App listening on port' + port))

// Logic

// function getPerson(req, res){
// // sql test
// var sql = "SELECT * FROM person WHERE person_id = $1"
// pool.query(sql, [req.params.id], function(err, result) {
//     // If an error occurred...
//     if (err) {
//         console.log("Error in query: ")
//         console.log(err);
//     }

//     // Log this to the console for debugging purposes.
//     //console.log("Back from DB with result:");
//     //console.log(result.rows);
//     res.send(result.rows[0]);
// });
// }

function login(req, res){
    var sql = "SELECT user_password FROM users WHERE username = $1"
    pool.query(sql, [req.body.username], function(err, result) {
    // If an error occurred...
    if (err) {
        console.log("Error in query: ")
        console.log(err);
    }
    if (result.rows.length == 0)
    {
        res.send({success: false})
    }
    else{
        bcrypt.compare(req.body.password, result.rows[0].user_password, function(err, compRes){
            if (compRes == true)
            {
                req.session.user = req.body.username
                res.send({success : true})
            }
            else{
                res.send({success: false})
            }
        })
        
    }
});
}

function logout(req, res){
    if (req.session.user == "none"){
        res.send({success : false})
    }
    else{
        // Something
        req.session.destroy(function(err){return})
        res.send({success : true})
    }
}

// function time(req, res){
//     var time = new Date()
//     res.send({success: true, time: time})
// }

// function setPass(req, res){
//     var sql = "UPDATE users SET user_password = $1 WHERE users_id = 1"
//     bcrypt.hash(req.params.password, 10, function(err, hash){
//         pool.query(sql, [hash], function(err, result) {
//             // If an error occurred...
//             if (err) {
//                 console.log("Error in query: ")
//                 console.log(err);
//             }
//             res.send('Success!')
//         });
//     })
    
// }

function getData(req, res)
{
    var type = req.params.type;
    var amount = req.params.amount;

    // param whitelist
    if (type != "race" && type != "class") return;
    //if (amount != "name" && amount != "all") return;

    var sql = ""
    if (amount == "all"){
        sql = "SELECT * FROM public." + type
    }
    else if (amount == "name"){
        sql = "SELECT " + type + "_name FROM public." + type
    }
    else{
        sql = "SELECT * FROM public." + type + " WHERE " + type + "_name = \'" + amount + "\'"
    }
    pool.query(sql, [], function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        // Log this to the console for debugging purposes.
        //console.log("Back from DB with result:");
        console.log(result.rows);
        res.send(result.rows);
    });
}

function getEditInfo(req, res){
    var kind = req.query.kind
    var name = req.query.name

    var sql = 'SELECT * FROM public.' + kind + ' WHERE ' + kind + '_name = $1'

    pool.query(sql, [name], function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        console.log(result.rows[0])
        res.send(result.rows[0])
    });
}

function updateDB(req, res){
    var data = req.body.item_to_edit.split(';')
    var type = data[0]
    var name = data[1]

    var special = ""
    var specialName = ""
    if (type == "race"){
        special = req.body.magic_rules
        specialName = "race_magic_rule"
    }
    else if (type == "class"){
        special = req.body.type
        specialName = "class_type";
    }

    var sql = 'UPDATE public.' + type + ' SET ' + type + '_name = $1, ' + type + '_hp = $2, ' + specialName + ' = $3, ' + type + '_rules = $4, ' + type + '_description = $5 WHERE ' + type + '_name = $1';
    console.log(sql)
    pool.query(sql, [name, req.body.hp, special, req.body.rules, req.body.description], function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        res.redirect('/edit')
    });
}

function addToDB(req, res){
    var type = req.body.item_to_add

    var special = ""
    if (type == "race"){
        special = req.body.magic_rules
    }
    else if (type == "class"){
        special = req.body.type
    }

    var arg_string = ""
    if (type == "race"){
        arg_string = "(race_name, race_hp, race_rules, race_magic_rule, race_description)"
    }
    else if (type == "class"){
        arg_string = "(class_name, class_hp, class_rules, class_type, class_description)"
    }

    var sql = 'INSERT INTO public.' + type + ' ' + arg_string + ' VALUES ($1, $2, $3, $4, $5)'
    console.log(sql)
    pool.query(sql, [req.body.name, req.body.hp, req.body.rules, special, req.body.description], function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        res.redirect('/edit')
    });
}

function deleteFromDB(req, res){
    var data = req.body.item_to_delete.split(';')
    var name = data[0]
    var value = data[1]

    var sql = 'DELETE FROM public.' + name + ' WHERE ' + name + '_name = $1'
    console.log(sql)
    pool.query(sql, [value], function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        res.redirect('/edit')
    });
}