const csv = require('csv-parser');
const fs = require('fs');
const results = [];

fs.createReadStream('characteristics.csv')
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

  // { id: '1', product_id: '1', name: 'Fit' }
// length:  3347679