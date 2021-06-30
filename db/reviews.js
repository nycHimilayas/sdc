const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const JSONStream = require('JSONStream');
const {Transform} = require('stream');
// const {results} = require('./reviews_photos.js');

mongoose.connect('mongodb://localhost:27017/sampleDB', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
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

// console.log('results in reviews: ', results[1]);



// let aggResults = Reviews.aggregate([
//   {$match: {product_id: '1'}},
//   {
//     $lookup:
//     {
//       from: 'characteristics',
//       localField: 'product_id',
//       foreignField: 'product_id',
//       as: '_characteristics'
//     },
//   },
//   // {
//   //   $unwind: {
//   //     path: '$_characteristics'
//   //   }
//   // },
//   {
//     $lookup:
//     {
//       from: 'characteristicsReviews',
//       localField: 'id',
//       foreignField: 'review_id',
//       as: 'vals'
//     }
//   },
//   {
//     $unwind: {
//       path: '$vals'
//     }
//   },
//   {
//     $group:
//     {
//       _id: '$ratings',
//       product_id: {$first: '$product_id'},
//       ratings: {$push: '$rating'},
//       recommend: {$push: {$cond: ['$recommend', 1, 0]}},
//       characteristics: {$push: '$_characteristics'},
//       vals: {$push: '$vals'}

//     }
//   },
//   // {
//   //   $project:
//   //   {
//   //     product_id: 1,
//   //     rating: 1,
//   //     ratings: '$ratings',
//   //     recommend: 1,
//   //     characteristics: 1,
//   //     vals:1,
//   //   }
//   // },
//   //  $lookup:
//   //  {
//   //    from: 'characteristicsReviews',
//   //    localField: 'characteristics.id',
//   //    foreignField: 'id',
//   //    as: 'vals'
//   //  }
//   // },

// ])
// // .explain("executionStats")
// .then( (data) => {
//   console.log('metaData: ', data[0]);
//   console.log('chars: ', data[0].characteristics[0][0]);
//   console.log('vals: ', data[0].vals[0]);
//   // res.status(200).json(data);
//   // console.log('data.characteristics: ', data[0].characteristics)
//    return data;
// })
// .catch((err) => {
//   console.log(err.message)
//   // res.sendStatus(500)

// })


// let charRevs = Characteristics.aggregate([
//   {$match: {product_id: '2'}},
//   {
//     $lookup:
//     {
//       from: 'characteristicsReviews',
//       localField: 'id',
//       foreignField: 'review_id',
//       as: '_characteristics'
//     },
//   },
//   {
//     $unwind: {
//       path: '$_characteristics'
//     }
//   },

//   // {
//   //   $group:
//   //   {
//   //     _id: '$ratings',
//   //     product_id: {$first: '$product_id'},
//   //     ratings: {$push: '$rating'},
//   //     recommend: {$push: {$cond: ['$recommend', 1, 0]}},
//   //     characteristics: {$push: '$_characteristics'},
//   //     vals: {$first: '$vals'}

//   //   }
//   // },
//   // {
//   //   $project:
//   //   {
//   //     product_id: 1,
//   //     rating: 1,
//   //     ratings: '$ratings',
//   //     recommend: 1,
//   //     characteristics: 1,
//   //     vals:1,
//   //   }
//   // },
//   //  $lookup:
//   //  {
//   //    from: 'characteristicsReviews',
//   //    localField: 'characteristics.id',
//   //    foreignField: 'id',
//   //    as: 'vals'
//   //  }
//   // },

// ]).exec()
// // .explain("executionStats")
// .then( (data) => {
//   console.log('charMetaData: ', data);
//   // res.status(200).json(data);
//   console.log('data.characteristics: ', data[0].characteristics)
//   // characteristics.forEach((item) {
//   //   CharacteristicReviews.aggregate([

//   //   ])
//   // })
//    return data;
// })
// .catch((err) => {
//   console.log(err.message)
//   // res.sendStatus(500)

// })




let metaResults = () => {
  let characteristicReviewResults = CharacteristicReviews.find()
}

// console.log('results from reviews: ', aggResults);
// console.log('resultsArr: ', resultsArr);
// Reviews.aggregate([
//   {$match: {product_id: 1}},
//   {
//     $lookup:
//     {
//       from: 'reviews',
//       localField: 'id',
//       foreignField: 'id',
//       as: 'results'
//     }
//   }
// ]).exec(function(err, results){
//   console.log('results:', results);
// });



// const outputDBConfigPhotos = { dbURL: 'mongodb://localhost:27017/sampleDB', collection: 'reviewphotos' };
// const writableStreamPhotos = streamToMongoDB(outputDBConfigPhotos);

// fs.createReadStream('../reviews_photos.csv')
//   .pipe(csv({
//       noheader: false,
//       headers: ['id','review_id','url']
//   }))
//   .pipe(writableStreamPhotos);


// const outputDBConfigTotalReviews = { dbURL: 'mongodb://localhost:27017/sampleDB', collection: 'totalReviews' };
// const writableStreamTotalReviews = streamToMongoDB(outputDBConfigTotalReviews);

// fs.createReadStream('../reviews.csv')
//   .pipe(csv({
//       noheader: false,
//       headers: ['id', 'product_id', 'rating', 'date', 'summary',
//        'body', 'recommend', 'reported', 'reviewer_name',
//        'reviewer_email', 'response', 'helpfulness', ]
//   }))
//   .pipe(writableStreamTotalReviews)


// const outputDBConfigCharacteristics = { dbURL: 'mongodb://localhost:27017/sampleDB', collection: 'characteristics' };
// const writableStreamCharacteristics = streamToMongoDB(outputDBConfigCharacteristics);

// fs.createReadStream('../characteristics.csv')
//   .pipe(csv({
//       noheader: false,
//       headers: ['id', 'product_id', 'name']
//   }))
//   .pipe(writableStreamCharacteristics)


// const outputDBConfigCharacteristicsReviews = { dbURL: 'mongodb://localhost:27017/sampleDB', collection: 'characteristicsReviews' };
// const writableStreamCharacteristicsReviews = streamToMongoDB(outputDBConfigCharacteristicsReviews);

// fs.createReadStream('../characteristic_reviews.csv')
//   .pipe(csv({
//       noheader: false,
//       headers: ['id', 'characteristic_id', 'review_id', 'value']
//   }))
//   .pipe(writableStreamCharacteristicsReviews)

  // id,product_id,rating,date,summary,body,recommend,reported,
// reviewer_name,reviewer_email,response,helpfulness
module.exports.Reviews = Reviews;
module.exports.ReviewPhoto = ReviewPhoto;
module.exports.Characteristics = Characteristics;
module.exports.CharacteristicReviews = CharacteristicReviews;






// ++++++++++++++++++++++++++++++++++++++++++++++

// // console.log('results in reviews: ', results[1]);



// // let aggResults = Reviews.aggregate([
// //   {$match: {product_id: '2'}},
// //   {
// //     $lookup:
// //     {
// //       from: 'characteristics',
// //       localField: 'product_id',
// //       foreignField: 'product_id',
// //       as: '_characteristics'
// //     },
// //   },
// //   {
// //     $unwind: {
// //       path: '$_characteristics'
// //     }
// //   },
// //   {
// //     $lookup:
// //     {
// //       from: 'characteristicsReviews',
// //       localField: 'product_id',
// //       foreignField: 'id',
// //       as: 'vals'
// //     }
// //   },
// //   {
// //     $group:
// //     {
// //       _id: '$ratings',
// //       product_id: {$first: '$product_id'},
// //       ratings: {$push: '$rating'},
// //       recommend: {$push: {$cond: ['$recommend', 1, 0]}},
// //       characteristics: {$push: '$_characteristics'},
// //       vals: {$first: '$vals'}

// //     }
// //   },
// //   // {
// //   //   $project:
// //   //   {
// //   //     product_id: 1,
// //   //     rating: 1,
// //   //     ratings: '$ratings',
// //   //     recommend: 1,
// //   //     characteristics: 1,
// //   //     vals:1,
// //   //   }
// //   // },
// //   //  $lookup:
// //   //  {
// //   //    from: 'characteristicsReviews',
// //   //    localField: 'characteristics.id',
// //   //    foreignField: 'id',
// //   //    as: 'vals'
// //   //  }
// //   // },

// // ]).exec()
// // // .explain("executionStats")
// // .then( (data) => {
// //   console.log('metaData: ', data);
// //   // res.status(200).json(data);
// //   console.log('data.characteristics: ', data[0].characteristics)
// //   // characteristics.forEach((item) {
// //   //   CharacteristicReviews.aggregate([

// //   //   ])
// //   // })
// //    return data;
// // })
// // .catch((err) => {
// //   console.log(err.message)
// //   // res.sendStatus(500)
// // })


// let charRevs = Characteristics.aggregate([
//   {$match: {product_id: '2'}},
//   {
//     $lookup:
//     {
//       from: 'characteristicsReviews',
//       localField: 'id',
//       foreignField: 'review_id',
//       as: '_characteristics'
//     },
//   },
//   {
//     $unwind: {
//       path: '$_characteristics'
//     }
//   },

//   // {
//   //   $group:
//   //   {
//   //     _id: '$ratings',
//   //     product_id: {$first: '$product_id'},
//   //     ratings: {$push: '$rating'},
//   //     recommend: {$push: {$cond: ['$recommend', 1, 0]}},
//   //     characteristics: {$push: '$_characteristics'},
//   //     vals: {$first: '$vals'}

//   //   }
//   // },
//   // {
//   //   $project:
//   //   {
//   //     product_id: 1,
//   //     rating: 1,
//   //     ratings: '$ratings',
//   //     recommend: 1,
//   //     characteristics: 1,
//   //     vals:1,
//   //   }
//   // },
//   //  $lookup:
//   //  {
//   //    from: 'characteristicsReviews',
//   //    localField: 'characteristics.id',
//   //    foreignField: 'id',
//   //    as: 'vals'
//   //  }
//   // },

// ]).exec()
// // .explain("executionStats")
// .then( (data) => {
//   console.log('charMetaData: ', data);
//   // res.status(200).json(data);
//   console.log('data.characteristics: ', data[0].characteristics)
//   // characteristics.forEach((item) {
//   //   CharacteristicReviews.aggregate([

//   //   ])
//   // })
//    return data;
// })
// .catch((err) => {
//   console.log(err.message)
//   // res.sendStatus(500)

// })
