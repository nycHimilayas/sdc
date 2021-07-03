const express = require('express');
const app = express();
const port = 3001;
// 3.17.165.198
const getProductReview = require('./aggregationFramework/addNewReview.js');
const putReviewsHelpful = require('./aggregationFramework/putHelpful.js');
const putReviewsHelpful = require('./aggregationFramework/putHelpful.js');
const putReviewReported = require('./aggregationFramework/putReported.js');
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const { Reviews, ReviewPhoto, CharacteristicReviews, Characteristics } =
 require('./reviews.js')

 app.post('/reviews', (req, res) => {

   const newReview = {
     product_id: req.body.product_id,
     rating: req.body.rating,
     date: new Date(),
     summary: req.body.summary,
     body: req.body.body,
     recommend: true,
     reported: null,
     reviewer_name: req.body.name,
     reviewer_email: req.body.email,
     response: null,
     helpfulness: null,
   };

   const newReviewPhoto = {
    id: 0000,
    review_id: 'test',
    url: req.body.photos,
  }

  const newReviewCharacteristics = {
    id: 'test',
    product_id: req.body.product_id,
    name: 'Test'
  }

  const newReviewCharacteristicsReviews = {
    testNumber: '1',
    testNumber: '2',
    testNumber: '3',
    testNumber: '4',
  }

  Reviews.create(newReview, { upsert: true })

  .then((data) => {
    // console.log('postData: ', data)
  })
  .catch((err) => {
    // console.err(err);
    res.sendStatus(404);
  })
  .then((data) => {
    ReviewPhoto.create(newReviewPhoto, { upsert: true })
    // console.log('postData2: ', data)
    res.status(201).json(data);
  })
  .catch((err) => {
    // console.err(err);
    res.sendStatus(404);
  })
})

app.get('/reviews', (req, res) => {
  // console.log('Reviews', Reviews);
  let _page = parseInt(req.query.page || 1);
  let _count = parseInt(req.query.count || 5);
  let _sort = req.query.sort;
  let _product_id = req.query.product_id;

  getProductReview()
  .then((data) => {
    const result = {
      product: _product_id,
      page: _page,
      count: data.length,
      results: data,
    }
    res.status(200).json(result);
  })
  .catch((err) => {
    res.sendStatus(500)
  });
})

app.get('/reviews/meta', (req, res) => {
  let _product_id = req.query.product_id;
  getProductReviewMeta();
})

app.put('/reviews/:review_id/helpful',  (req, res) => {
  let _id = req.params.review_id;
  putReviewsHelpful();
})

app.put('/reviews/:review_id/report',  (req, res) => {
  let _id = req.params.review_id;
  putReviewsHelpful();
})

app.listen(port, () => {
  console.log(`getReviews listening at http://localhost:${port}`)
})

