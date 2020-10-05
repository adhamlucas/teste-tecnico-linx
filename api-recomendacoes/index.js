const express = require('express');
const app = express();
const port = 3001;
const routes = require('./src/routes/Routes');

app.use(express.json());
app.use(routes);

// const main = async() => {
//   console.time('timerIndex');
//   let algo = await ShowCase.getShowCases(70).catch((reason) => {
//     console.log('ola',reason)
//     console.log("DENTRO DO INDEX.JS")
//   })
//   console.timeEnd('timerIndex');
//   return algo;
// }
// main().then((value) => console.log(value.mostPopular.length));

app.listen(port, () => {
  console.log(`The server is runing on: http://localhost:${port}`)
});