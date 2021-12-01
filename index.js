const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
require('dotenv').config()
const cors = require('cors');


const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// database connection url
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bitd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// connecting database

async function run (){
    try{
        await client.connect();

        const database = client.db('car_project-2');
        const servicesCollection = database.collection('services');

        // GET API
        app.post('/services',async(req,res) => {
            console.log('hitting the api');
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        app.get('/services',async(req,res) => {
            const cursor = servicesCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        // GET a single service
        app.get('/services/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // DELETE API
        app.delete('/services/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            console.log('data is deleted',result);
            res.json(result);
        });

        // PUT API
        app.put('/services/:id',async(req,res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            console.log('hitting the api',updatedUser);

            const filter = {_id: ObjectId(id)};
            // const options = { upsert:true};

            const updateDoc = {
                $set: {
                    img:updatedUser.IMG,
                    name:updatedUser.name,
                    price:updatedUser.price,
                    description: updatedUser.description
                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc);
            console.log('result found',result);
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );
            res.json(result);

        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/',(req,res) => {
    res.send('hello genius car server is running');
})

app.listen(port,() => {
    console.log('port on running',port);
})