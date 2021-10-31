const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g3vr0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        await client.connect();
        const database = client.db('Toursim');
        const servicesCollection = database.collection('services');
        const upcomingCollection = database.collection('upcoming');
        const orderCollection = database.collection('order');


        // GET API
        app.get('/places', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        // GET Upcoming API
        app.get('/upcoming', async (req, res) => {
            const UpcomingCursor = upcomingCollection.find({});
            const Upcoming = await UpcomingCursor.toArray();
            res.send(Upcoming);
        });
        // GET SINGLE SERVICE
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting Specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });
        // hjjhjhjh
        app.get('/order/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting Specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await orderCollection.findOne(query);
            res.json(service);
        });
        //POST-API
        app.post('/places', async (req, res) => {
            const service = req.body;
            console.log('service', service)
            console.log('hit the post');
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        //POST order API-----------------------------post order
        app.post('/order', async (req, res) => {
            const orders = req.body;
            console.log('hit the post API', orders);

            const result = await orderCollection.insertOne(orders);
            console.log(result);
            res.json(result)
        })
        //GET ORDER API---------------------------get order
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);

        })
        //UPDATE API
        app.put('/places/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })
        // delete api
        app.delete('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        })
// delete api my order
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Tourism server is Running");
})

app.listen(port, () => {
    console.log("Server is Running", port);
})