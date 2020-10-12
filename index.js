const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//DataBase info
const dbInfo = {
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_COLLECTION: process.env.DB_COLLECTION,
  DB_ORDER_COLLECTION: process.env.DB_ORDER_COLLECTION,

};

const uri = `mongodb+srv://${dbInfo.DB_USER}:${dbInfo.DB_PASS}@ema-john-simple.9zi9c.mongodb.net/${dbInfo.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




client.connect(err => {
  const productCollection = client.db(`${dbInfo.DB_NAME}`).collection(`${dbInfo.DB_COLLECTION}`);
  const orderCollection = client.db(`${dbInfo.DB_NAME}`).collection(`${dbInfo.DB_ORDER_COLLECTION}`);

  app.post('/addProducts', (req, res) =>{
    const products = req.body;
    productCollection.insertOne(products)
    .then(result =>{
     res.send(result.insertedCount);
    });
  });
  
  app.get('/products', (req, res) =>{
    productCollection.find({})
    .toArray((err, result) =>{
      res.send(result);
    });
  });

  app.get('/product/:key', (req, res) =>{
    productCollection.find({key: req.params.key})
    .toArray((err, result) =>{
      res.send(result[0]);
    });
  });

  app.post('/productsByKeys', (req, res) =>{
    const productsKeys = req.body;
    productCollection.find({key: {$in: productsKeys}})
    .toArray((err, result) =>{
      res.send(result);
    });
  });


  app.post('/addOrder', (req, res) =>{
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result =>{
      res.send(result.insertedCount > 0);
    });
  });
  

});  

app.listen(4200, () => console.log('Listening to Port 4200'));