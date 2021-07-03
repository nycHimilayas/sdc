const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const JSONStream = require('JSONStream');
const {Transform} = require('stream');

mongoose.connect('mongodb://localhost:27017/sampleDB', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
// mongoose.connect('mongodb://18.224.56.188:27017/sampleDB', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => console.log('success from db'))
  .catch((err) => console.log('err in db: ', err.response))

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  //we're connected!
// console.log('Connection Successful!');
})

const reviewPhotoSchema = new mongoose.Schema({
  id: {type: Number, index: true },
  review_id: {type: Number, index: true },
  url: String
});

const ReviewPhoto = mongoose.model('ReviewPhoto', reviewPhotoSchema)


const ReviewsSchema = new mongoose.Schema({
  id: {type: String, index: true },
  product_id: {type: String, index: true },
  rating: {type: Number, min: 1, max: 5, index: true},
  date: { type: Date, index: true },
  summary: {type: String, maxlength: 100, index: true},
  body: {type: String, maxlength: 240, index: true},
  recommend: {type: Boolean, index: true},
  reported: {type: Boolean, index: true},
  reviewer_name: {type: String},
  reviewer_email: {type: String},
  response: {type: String},
  helpfulness: {type: Number, min: 1, max: 5},
}, {collection : 'reviews'});


const Reviews = mongoose.model('Reviews', ReviewsSchema, 'reviews')


const characteristicsSchema = new mongoose.Schema({
  id: {type: String, index: true },
  product_id: {type: String, index: true },
  name: {type: String, maxlength: 20, index: true}
}, {collection : 'characteristics'})


const Characteristics = mongoose.model('Characteristics', characteristicsSchema, 'characteristics');


const characteristicReviewsSchema = new mongoose.Schema({
  id: {type: String, index: true },
  characteristic_id: {type: String, index: true},
  review_id: {type: String, index: true },
  value: {type: String, max: 5, index: true}
}, {collection: 'characteristicReviews'});

const CharacteristicReviews = mongoose.model('CharacteristicReviews', characteristicReviewsSchema, 'characteristicReviews');

// Data Streams
const outputDBConfigPhotos = { dbURL: 'mongodb://localhost:27017/sampleDB', collection: 'reviewphotos' };
const writableStreamPhotos = streamToMongoDB(outputDBConfigPhotos);

fs.createReadStream('../reviews_photos.csv')
  .pipe(csv({
      noheader: false,
      headers: ['id','review_id','url']
  }))
  .pipe(writableStreamPhotos);


const outputDBConfigTotalReviews = { dbURL: 'mongodb://localhost:27017/sampleDB', collection: 'totalReviews' };
const writableStreamTotalReviews = streamToMongoDB(outputDBConfigTotalReviews);

fs.createReadStream('../reviews.csv')
  .pipe(csv({
      noheader: false,
      headers: ['id', 'product_id', 'rating', 'date', 'summary',
       'body', 'recommend', 'reported', 'reviewer_name',
       'reviewer_email', 'response', 'helpfulness', ]
  }))
  .pipe(writableStreamTotalReviews)


const outputDBConfigCharacteristics = { dbURL: 'mongodb://localhost:27017/sampleDB', collection: 'characteristics' };
const writableStreamCharacteristics = streamToMongoDB(outputDBConfigCharacteristics);

fs.createReadStream('../characteristics.csv')
  .pipe(csv({
      noheader: false,
      headers: ['id', 'product_id', 'name']
  }))
  .pipe(writableStreamCharacteristics)


const outputDBConfigCharacteristicsReviews = { dbURL: 'mongodb://localhost:27017/sampleDB', collection: 'characteristicsReviews' };
const writableStreamCharacteristicsReviews = streamToMongoDB(outputDBConfigCharacteristicsReviews);

fs.createReadStream('../characteristic_reviews.csv')
  .pipe(csv({
      noheader: false,
      headers: ['id', 'characteristic_id', 'review_id', 'value']
  }))
  .pipe(writableStreamCharacteristicsReviews)

//   id,product_id,rating,date,summary,body,recommend,reported,
// reviewer_name,reviewer_email,response,helpfulness
module.exports.Reviews = Reviews;
module.exports.ReviewPhoto = ReviewPhoto;
module.exports.Characteristics = Characteristics;
module.exports.CharacteristicReviews = CharacteristicReviews;
