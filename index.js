const express = require("express");
const app = express();
const cors = require("cors")
const Router = require("./src/routes/indexRoute")

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cors({
    origin: "*"
}))

app.listen(3005, () => {
    console.log(` App is listening on port 3005`);
})

app.use('/api/v1', Router)

app.get('/api/demo', (req, res) => {
    res.json({
        msg: "OK"
    })
})