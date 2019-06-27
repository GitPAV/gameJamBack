const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")

const cors = require("cors")

const routes = require("./routes/")

const app = express()
const port = 4242

app.use(morgan("dev"))
app.use(morgan(":method :url :status :res[content-length] - :response-time "))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cors());


// routes : 

app.use("/users", routes.users)
app.use("/soldier", routes.soldier)


// end of routes

app.get("/", (req, res) => {
  res.status(200).send("je suis dans /")
})

app.listen(port, console.log(`http://localhost:${port}`))
