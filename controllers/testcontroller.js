var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
  let autumn = 'great';
  let alecx = true;
  res.send('this is a test route!');
})

module.exports = router;