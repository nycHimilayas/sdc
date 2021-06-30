const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const { Reviews, ReviewPhoto, CharacteristicReviews, Characteristics } =
 require('./reviews.js')

 app.post('/reviews', (req, res) => {
  // console.log('reqBody: ', req.body)

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
    id: 8789,
    review_id: 09098,
    url: req.body.photos,
  }

  const newReviewCharacteristics = {
    id: 'test',
    product_id: req.body.product_id,
    name: 'Fit'
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

  let _results = Reviews.aggregate([
     {$match: {product_id: _product_id}},
    {
      $lookup:
      {
        from: 'reviewphotos',
        localField: 'id',
        foreignField: 'review_id',
        as: 'photos'
      },
    },
    {
      $project:
      {
        _id: 0,
        reviewer_email: 0,
        reported: 0,
      }
    },
    {
      $project:
      {
        review_id: '$id',
        rating: '$rating',
        summary: '$summary',
        recommend: '$recommend',
        response: '$response',
        body: '$body',
        date: '$date',
        reviewer_name: '$reviewer_name',
        helpfulness: '$helpfulness',
        photos: '$photos',
      }
    },
    {
      $project:
      {
        review_id: 1,
        rating: 1,
        summary: 1,
        recommend: 1,
        response: 1,
        body: 1,
        date: 1,
        reviewer_name: 1,
        helpfulness: 1,
        photos: 1,
      }
    }
  ]).limit(_count).sort(`-${_sort}`)
  .then((data) => {
    const result = {
      product: _product_id,
      page: _page,
      count: data.length,
      results: data,
    }
    // console.log('result', result)
    res.status(200).json(result);
  })
  .catch((err) => {
    // console.log(err.message)
    res.sendStatus(500)
  });
})

app.get('/reviews/meta', (req, res) => {
  let _product_id = req.query.product_id;
  Reviews.aggregate([
    {$match: { product_id: _product_id }},
    {
      $lookup:
      {
        from: 'characteristics',
        localField: 'product_id',
        foreignField: 'product_id',
        as: '_characteristics'
      },
    },
    {
      $lookup:
      {
        from: 'characteristicsReviews',
        localField: 'id',
        foreignField: 'review_id',
        as: 'vals'
      }
    },
    {
      $group:
      {
        _id: '$ratings',
        product_id: {$first: '$product_id'},
        ratings: {$push: '$rating'},
        recommend: {$push: {$cond: ['$recommend', 1, 0]}},
        characteristics: {$push: '$_characteristics'},
        vals: {$push: '$vals'}
      }
    },
  ])
  .then( (data) => {

    let _ratings = {};
    let _recommend = {'false': 0, 'true': 0};
    let _characteristics = {};
    let _dataTotals = {
      Fit: 0,
      totalFit: 0,
      fitAverage: 0,
      fitId: 0,
      Length: 0,
      totalLength: 0,
      lengthAverage: 0,
      lengthId: 0,
      Comfort: 0,
      totalComfort: 0,
      comfortAverage: 0,
      comfortId: 0,
      Quality: 0,
      totalQuality: 0,
      qualityAverage: 0,
      qualityId: 0,
      TotalRatings: 0,
    };

    data[0].ratings.forEach((item) => {
      if (_ratings[item] === undefined) {
      _ratings[item] = 1;
      } else {
        _ratings[item]++
      }
    })

    data[0].recommend.forEach((item) => {

      if (_recommend[item] === 0) {
        _recommend['false']++
      } else {
        _recommend['true']++
      }
    })

    data[0].characteristics[0].forEach((item) => {
      if (_characteristics[item.name] === undefined) {
        _characteristics[item.name] = 0;
      }
    })

    data[0].vals.forEach((item) => {
      item.forEach((val) => {
        // console.log('itemVal***', val.characteristic_id)
        // console.log('itemVal***', val.characteristic_id === '1')
        if (val.characteristic_id === '1') {
          _dataTotals.Fit += parseInt(val.value);
          _dataTotals.totalFit++
          _dataTotals.fitId += parseInt(val.id);
        }
        if (val.characteristic_id === '2') {
          _dataTotals.Length += parseInt(val.value);
          _dataTotals.totalLength++
          _dataTotals.lengthId += parseInt(val.id);

        }
        if (val.characteristic_id === '3') {
          _dataTotals.Comfort += parseInt(val.value);
          _dataTotals.totalComfort++;
          _dataTotals.comfortId += parseInt(val.id);

        }
        if (val.characteristic_id === '4') {
          _dataTotals.Quality += parseInt(val.value);
          _dataTotals.totalQuality++;
          _dataTotals.qualityId += parseInt(val.id);

        }
        _dataTotals.TotalRatings += parseInt(val.value);
      })
    })

    _dataTotals.fitAverage = (_dataTotals.Fit / _dataTotals.totalFit).toFixed(2);
    _dataTotals.lengthAverage = (_dataTotals.Length / _dataTotals.totalLength).toFixed(2);
    _dataTotals.comfortAverage = (_dataTotals.Comfort / _dataTotals.totalComfort).toFixed(2);
    _dataTotals.qualityAverage = (_dataTotals.Quality / _dataTotals.totalQuality).toFixed(2);

    const result = {
      product: _product_id,
      ratings: _ratings,
      recommend: _recommend,
      characteristics: {
        Fit: {
          id: _dataTotals.fitId,
          value: _dataTotals.fitAverage,
        },
        Length: {
          id: _dataTotals.lengthId,
          value: _dataTotals.lengthAverage,
        },
        Comfort: {
          id: _dataTotals.comfortId,
          value: _dataTotals.comfortAverage,
        },
        Quality: {
          id: _dataTotals.qualityId,
          value: _dataTotals.qualityAverage,
        },
      }
    }
    res.status(200).json(result);
  })
  .catch((err) => {
    // console.log(err.message)
    res.sendStatus(500)
  })
})

app.put('/reviews/:review_id/helpful',  (req, res) => {
  let _id = req.params.review_id;
    Reviews.aggregate([
      {$match: {id: _id}},
    ])
  .then((data) => {
    let addOne = parseInt(data[0].helpfulness);
    addOne++;
    addOne = `${addOne}`;
    Reviews.updateOne(
      {id: _id},
      {$set: {helpfulness: `${addOne}`}},
    )
    .then((data) => {
      res.status(201).json(data[0])
    })
  })
  .catch((err) => {
    res.status(404);
  })
})

app.put('/reviews/:review_id/report',  (req, res) => {
  let _id = req.params.review_id;
    Reviews.aggregate([
      {$match: {id: _id}},
    ])
  .then((data) => {
    let _reported = data[0].reported
    console.log('reported:', _reported)
    Reviews.updateOne(
      {id: _id},
      {$set: {reported: true}},
    )
    .then((data) => {
      res.status(201).json(data[0])
    })
  })
  .catch((err) => {
    res.status(404);
  })
})

app.listen(port, () => {
  console.log(`getReviews listening at http://localhost:${port}`)
})

