const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleware
app.use(cors())
app.use(express.json())


// username and password
// ismatjahanbijori
// 1HhXJLhcjMkrHO2X


const uri = "mongodb+srv://ismatjahanbijori:1HhXJLhcjMkrHO2X@cluster0.hbyxuz9.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // mongodb connection: insert a document
        // usersDB table er nam
        const database = client.db("usersDB");
        // users hocche content er nam
        const usersCollection = database.collection("users");

        // read operation
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })


        // update operation
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })
        // create operation
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            // mongodb connection: insert a document
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        // update user: data accessed from client side
        app.put('/users/:id', async(req, res)=>{
            const id=req.params.id;
            const user=req.body;
            console.log(id, user)

            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedUser={
                $set:{
                    name:user.name,
                    email:user.email
                }
            }
            const result = await usersCollection.updateOne(filter, updatedUser, options);
            res.send(result)
        })


        // delete operation
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete data from db', id)
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);

app.get('/', (req, res) => {
    res.send('Simple MongoDB crud!')
})

app.listen(port, () => {
    console.log(`Simple MongoDB crud on port ${port}`)
})