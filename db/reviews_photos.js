const csv = require('csv-parser');
const fs = require('fs');
const results = [];

fs.createReadStream('../reviews_photos.csv')
  .pipe(csv({
    noheader: false,
    headers: ['id','review_id','url']
}))
  .on('data', (data) => {
    // console.log('data:', data);
    results.push(data);
  })
  .on('end', () => {
    console.log(results[0]);
    console.log('length: ', results.length);
  })

  exports.results = results;



//   { id: 'id', review_id: 'review_id', url: 'url' }
// length:  2742541