import express from 'express'
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config' 
import cors from 'cors'

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB()
const db = mongoClient.db('wanderlust')
const destinationCollection = db.collection('destination')

app.get('/', (req, res) => {
    res.send({message: 'server is running fine'})
})

app.post('/add-destination', async (req, res) => {
  const data = req.body
  const result = await destinationCollection.insertOne(data)
  res.send(result)
})

app.get('/destinations', async (req, res) => {
  const des = await destinationCollection.find().toArray()
  res.send(des)
})

app.get('/destination/:id', async(req, res) => {
  const {id} = req.params
  const result = await destinationCollection.findOne({_id: new ObjectId(id)})
  res.send(result)
  // const des = await destinationCollection.findOne()
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})
