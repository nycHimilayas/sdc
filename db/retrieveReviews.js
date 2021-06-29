const mongoose = require('mongoose');
const Reviews = require('./reviews.js')


// console.log(db);
console.log('rev: ', Reviews);

const filter = {product_id: pid};

// let retrieve = (pid) => {
//   console.log("pid", pid)
//    return Reviews.find({"id": pid}, null)
// }
// let retrieve = await reviews.aggregate([
//   {$match: filter}
// ])



// const filter = {product_id: pid};


module.exports = retrieve;