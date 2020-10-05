const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./src/routes/Routes');
const port = 3001;

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(port, () => {
  console.log(`The server is runing on: http://localhost:${port}`)
});