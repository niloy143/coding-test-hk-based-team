require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send({ status: 'running' })
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sq5icdb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const sectorsCollection = client.db('coding-test-hk-based-team').collection('sectors');
        const usersCollection = client.db('coding-test-hk-based-team').collection('users');
        app.get('/sectors', async (req, res) => {
            const sectors = await sectorsCollection.find({}).toArray();
            res.send(sectors);
        })

        app.get('/user', async (req, res) => {
            const user = await usersCollection.findOne({ _id: ObjectId(req.query.id) });
            res.send(user);
        })

        app.post('/user', async (req, res) => {
            const result = await usersCollection.insertOne(req.body);
            res.send(result);
        })

        app.put('/user', async (req, res) => {
            const result = await usersCollection.updateOne({ _id: ObjectId(req.query.id) }, { $set: req.body }, { upsert: true });
            res.send(result);
        })
    }
    catch (err) {
        console.log(err)
    }
}

run().catch(err => console.log(err))

app.listen(port, () => {
    console.log(`Server is listening to ${port}`)
})