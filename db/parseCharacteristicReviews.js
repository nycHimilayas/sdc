const csv = require('csv-parser');
const fs = require('fs');
const results = [];

fs.createReadStream('characteristic_reviews.csv')
  .pipe(csv())
  .on('data', (data) => {
    // console.log('data:', data);
    results.push(data);
  })
  .on('end', () => {
    console.log(results[0]);
    console.log('length: ', results.length);
  })


// { id: '1', characteristic_id: '1', review_id: '1', value: '4' }
// length:  19327575

