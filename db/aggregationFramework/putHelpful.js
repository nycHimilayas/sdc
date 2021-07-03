module.exports.putReviewsHelpful = () => {
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
}