module.exports.getProductReviewMeta = () => {
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
    res.sendStatus(500)
  })
}