const csv = require('csv-parser');
const fs = require('fs');
const results = [];

fs.createReadStream('reviews.csv')
  .pipe(csv())
  .on('data', (data) => {
    // console.log('data:', data);
    results.push(data);
  })
  .on('end', () => {
    console.log(results[0]);
    console.log('length: ', results.length);
  })

  exports.results = results;

  // read the file, fills the buffer, buffer passes chunk on (data)
  // listen for that passing of the chunk
  // pass the chunk on

  // {
//   id: '1',
//   product_id: '1',
//   rating: '5',
//   date: '1596080481467',
//   summary: 'This product was great!',
//   body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
//   recommend: 'true',
//   reported: 'false',
//   reviewer_name: 'funtime',
//   reviewer_email: 'first.last@gmail.com',
//   response: 'null',
//   helpfulness: '8'
// }
// length:  5774952