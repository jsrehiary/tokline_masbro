const express = require("express")
const mysql = require("mysql")
const BodyParser = require("body-parser")

const app = express()
const db = mysql.createConnection({
    host: "localhost",
    database: "db_tokline",
    user: "root",
    password: ""
})

app.use(BodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")
app.set("views", "views")

db.connect((err) => {
    if (err) throw err
    console.log("DB Connected.")
})

app.get("/", (req, res) => {
    const q = "SELECT * FROM `user`;"
    db.query(q, (err, result) => {
        const users = JSON.parse(JSON.stringify(result))
        res.render("index", {title: "Index", users: users})
    })
})

// CREATE
app.post("/add", (req, res) => {
    const q = "INSERT INTO `user` (`Username`, `Password` ,`Email`, `Phone`) VALUES (?, ?, ?, ?);"
    
    let username = req.body.Username,
        password = req.body.Password,
        email = req.body.Email,
        phone = req.body.Phone

    db.query(q, [username, password, email, phone], (err, rows, fields) => {
        if (err) throw err
        res.redirect("/")
    })
})

// DELETE
app.get("/remove/(:PersonID)", (req, res) => {
    const q = `DELETE FROM \`user\` WHERE \`PersonID\` = ${req.params.PersonID}`;
    db.query(q, (err, reuslt) => {
        if (err) throw err
        res.redirect("/")
    })
    
})

// UPDATE
app.get("/update/(:PersonID)", (req, res) => {
    const q = `UPDATE  \`user\` SET 
    Username = "${req.body.Username}",
    Password = "${req.body.Password}",
    Email = "${req.body.Email}",
    Phone = "${req.body.Phone}"
    WHERE PersonID = "${req.params.PersonID}"`

    db.query(q, (err, result) => {
        console.log(result)
        res.redirect("/")
    })
})

// SEARCH
app.get("/search", (req, res) => {
    const q = `SELECT * FROM \`user\` WHERE \`Username\` 
                LIKE '%${req.query.q}%' 
                OR \`Email\` LIKE '%${req.query.q}%'
                OR \`PersonID\` LIKE '%${req.query.q}%'
                OR \`Phone\` LIKE '%${req.query.q}%';`
    db.query(q, (err, result) => {
        const users = JSON.parse(JSON.stringify(result))
        res.render("index", {users: users, title: `Search result of "${req.query.q}"`})
    })
})



const port = 8000

app.listen(port, () => {
    console.log(`Listenin at http://localhost:${port}`)
})