const reviewsSchema = new mongoose.Schema({
  product:
})

const reviewsSchema = new Schema({
  product: Number,
  page: Number,
  count: Number,
  results: [
      review_id: Number,
      rating: {type: Number, min: 1, max: 5},
      summary: {type: String, minlength 0, maxlength: 100},
      recommend: Boolean,
      body: {type: String, minlength 0, maxlength: 240},
      date: { type: Date },
      reviewer_name: String,
      helpfulness: Number,

  ],

})