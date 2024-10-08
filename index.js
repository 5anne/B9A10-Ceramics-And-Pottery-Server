const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwtdtr7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const itemCollection = client.db("itemDB").collection("items");
        const newItemCollection = client.db("itemDB").collection("newItems");

        app.get('/items', async (req, res) => {
            const cursor = itemCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await itemCollection.findOne(query);
            res.send(result);
        })

        app.get('/newItems', async (req, res) => {
            const cursor = newItemCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/newItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await newItemCollection.findOne(query);
            res.send(result);
        })

        app.post('/newItems', async (req, res) => {
            const newItems = req.body;
            console.log(newItems);
            const result = await newItemCollection.insertOne(newItems);
            res.send(result);
        })

        app.put('/newItems/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedItems = req.body;
            const items = {
                $set: {
                    image: updatedItems.image,
                    item_name: updatedItems.item_name,
                    subcategory_name: updatedItems.subcategory_name,
                    short_description: updatedItems.short_description,
                    price: updatedItems.price,
                    rating: updatedItems.rating,
                    customization: updatedItems.customization,
                    processing_time: updatedItems.processing_time,
                    stock_status: updatedItems.stock_status
                }
            }
            const result = await newItemCollection.updateOne(filter, items, options);
            res.send(result);
        })

        app.delete('/newItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await newItemCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Page is loading!!!');
})

app.listen(port, () => {
    console.log(`PAGE IS LOADING ON PORT ${port}`);
})
