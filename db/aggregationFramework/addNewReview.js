module.exports.getProductReview = () => {
  Reviews.aggregate([
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
};