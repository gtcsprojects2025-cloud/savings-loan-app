const express = require("express")
const PORT = 5000
const app = express()

app.use("/", (req, res)=>{
    res.send("Server is running")
})

app.listen(PORT, console.log(`Server is running on port ${PORT}`))