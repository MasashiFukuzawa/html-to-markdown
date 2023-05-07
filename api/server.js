const express = require('express');

const app = express();

const port = 8080;

app.get('/api', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
  console.log(`html-to-markdown app listening at http://localhost:${port}`);
});
