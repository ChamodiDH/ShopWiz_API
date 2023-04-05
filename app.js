const path = require('path');
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const mongoose = require('mongoose')
const adminRoutes = require('./routes/admin')


// parse application/json
app.use(bodyParser.urlencoded({ extended: true }))

//app.use(express.json())
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/admin',adminRoutes)


mongoose
  .connect(
    'mongodb+srv://chamodi3797:7Un9yziq0tVDFxrD@cluster0.kmqiivj.mongodb.net/shopWiz?retryWrites=true&w=majority'
  )
  .then(result => {
    app.listen(8080, () => {
        console.log('connected to db')
        
    });
  })
  .catch(err => console.log(err));


