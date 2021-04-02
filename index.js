const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const db = process.env.DB_DATABASE;
const collection = process.env.DB_COLLECTION;
const orderCollection = process.env.DB_ORDERCOLLECTION;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${user}:${pass}@cluster0.67sz6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors());


client.connect(err => {
  const bookCollection = client.db(`${db}`).collection(`${collection}`);
  const ordersCollection = client.db(`${db}`).collection(`${orderCollection}`);

  app.get('/allbooks', (req, res)=>{
    bookCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    });
  });

  app.post('/addnewbook', (req, res) =>{
    const data = req.body;
    bookCollection.insertOne(data)
    .then(result => {});
  });

  app.delete('/removebook/:bookid', (req, res)=>{
    const id =req.params.bookid;
    bookCollection.deleteOne({ 
      _id: ObjectId(id)
    })
    .then(function(result) {
      res.send(result.deletedCount > 0);
    });
  });

  app.get('/checkOut/:bookid', (req, res)=>{
    const id = req.params.bookid;
    bookCollection.findOne({_id: ObjectId(id)})
    .then(( doc)=>{
      res.send(doc);
    });
  });

  app.post('/orderedbook', (req,res)=>{
    ordersCollection.insertOne(req.body)
    .then(result =>{});
  });

  app.get('/allOrderBooks/:email', (req, res)=>{
    const email = req.params.email;
    ordersCollection.find({email: email})
    .toArray((err, docs)=>{
      res.send(docs);
    });
  });

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})