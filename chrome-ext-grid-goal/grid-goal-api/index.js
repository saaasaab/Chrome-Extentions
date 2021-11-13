const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const routes = require("./routes");
const connection = require("./connection");

const userData = [{
    "id": 1636446205855,
    "due_date": "Sun May 08 2022 00:23:25 GMT-0700 (Pacific Daylight Time)",
    "icon": "workout",
    "multiplier": 25,
    "num_cells": 200,
    "status": true,
    "title": "Give 5,000 Dollars in 180 days",
    "total_completed": 723,
    "total_time": 180,
    "value": 5000,
    "progress": {
        "0": 0,
        "1": 723,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0
    }
}];


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "gridgoal",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
connection.init();
routes.configure(app);

// app.post('/login', (req, res) => {
//     try {
//         const sqlQuery= "SELECT active_goals FROM users where password = (?)";
//         console.log(req.body)
//         db.query(sqlQuery,(err,result)=>{
            

//         })
//         //Send the the userdata regardless of the login creds
//         res.send(userData)
//     }
//     catch {
//         res.send(500);
//     }

// })

app.listen(3001, () => {
    console.log("running on port 3001");
});

