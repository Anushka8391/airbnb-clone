const express = require('express');
const router = express.Router();

// Example posts routes
router.get('/', (req, res) => {
  res.send('Posts index');
});

router.get('/:id', (req, res) => {
  res.send(`Post ${req.params.id}`);
});

module.exports = router;
