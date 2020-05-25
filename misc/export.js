const _ = require('lodash');
const request = require('request');
const parse = require('csv-parse');
var strapi = require('strapi')();
var fs = require('fs');

let converter = require('json-2-csv');

// const remoteLink = "..."
const localFile = "./data.csv"

async function fetchData(data) {
  
  data = data.map((item) => {
    let {
      id,
      name,
      description,
      short_description,
      categories
    } = item;


    return {
      id,
      name,
      description,
      short_description,
      categories: categories.map((cat) => cat.name).join('/')
    }
  });
  return converter.json2csvAsync(data).then((csv) => {
    let file = fs.writeFileSync(localFile, csv);
    // source = request(remoteLink)
    // source = fs.createReadStream(localFile)
    // source.pipe(parse()).on('data', (row) => {
    //   if(!header) { header = row; return; }
    //   row = row.map(item=>item=='N/A' ? '' : item);
    //   data.push(_.zipObject(header, row))
    // }).on('end', () => {
    //   resolve(data);
    // });
  })
  .catch((err) => console.log(err));
}

async function getData() {
  let count = await strapi.query('plugins').count();
  let data = [];
  const perPage = 100;
  for (let i = 0; i < count;) {
    let res = await strapi.query('plugins').find({_limit: perPage, _start: i}, ['categories', 'categories.name']);
    data = data.concat(res);
    if (i==data.length) 
      break;
    i = data.length;
  }
  return {data, count};
}

async function initStrapi() {
  await strapi.load();
  await strapi.runBootstrapFunctions();
  return strapi;
}

async function main() {
  let strapi = await initStrapi();
  let {data, count} = await getData();

  console.log(data.length);
  console.log(count);

  await fetchData(data);
}
main();