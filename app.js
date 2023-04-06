const path = require('path');
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const mongoose = require('mongoose')
const adminRoutes = require('./routes/admin')
const multer = require('multer')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}


// parse application/json
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
//app.use(express.json())
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

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


