const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();


app.get("/", (req,res) => {
    res.send("API is running")
})


app.listen(port, ()=>{
    console.log(`API is running on port: ${port}`)
})
