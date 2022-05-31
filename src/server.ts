import express from "express"

const app = express()
const port = process.env.PORT || 3000

app.get("/", (req, res) => res.send("Hello world"))

app.listen(port, () => console.log(`Application running on port ${port}`))
