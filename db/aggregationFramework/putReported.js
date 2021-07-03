module.exports.putReviewReported = () => {
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
}