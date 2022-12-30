const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();


app.get("/", (req,res) => {
    res.send("API is running")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gsikg7k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const tasksCollection = client.db('tasksDB').collection('tasks')
        app.post("/task", async(req,res)=>{
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result)
        })
        app.get("/task", async(req,res)=>{
            let query ={};
            if(req.query.email){
                let userEmail = req.query.email
                query = {email: userEmail}
            }
            if(req.query.email && req.query.status){
                userEmail = req.query.email;
                let userStatus = req.query.status;
                query={email: userEmail,
                        status: userStatus}
            }
            const cursor = tasksCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)

        })
        app.put("/task/:id", async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set:{
                    status: "Completed"
                }
            }
            const result = await tasksCollection.updateOne(query,updatedDoc,options)
        })
    }
    finally{

    }
}
run().catch(error=>{
    console.log(error)
})


app.listen(port, ()=>{
    console.log(`API is running on port: ${port}`)
})
