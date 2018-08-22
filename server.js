const path = require('path');
const express = require('express');

const app = express();

const port = process.env.PORT ? process.env.PORT : 8080;

const target = path.join(__dirname, 'build');

app.use(express.static(target));

app.get('/*', (req, res) => {
  res.sendFile(path.join(target, 'index.html'));
});

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  }
  console.info('Express is listening on port %s.', port); 
});
