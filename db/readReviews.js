const fs = require('fs');
const fastcsv = require('@fast-csv/parse');
const reviews = require('../reviews.csv');
const {results} = require('./parseReviews.js')

let stream = fs.createReadStream('results')
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on('data', (data) => {
    csvData.push({
      id: data[0]
    });
  })
  .on('end', () => {
    csvData.shift();
    console.log('hopefullyFirstLine', JSON.stringify(csvData[0]))
  });

  stream.pipe(cvsStream);
  // console.log('hopefullyFirstLine', JSON.stringify(csvData[0]))
//   id,product_id,rating,date,summary,body,recommend,reported,
// reviewer_name,reviewer_email,response,helpfulness



function name(val) {
  console.log(val);
}

