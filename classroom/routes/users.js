const express = require('express');
const router = express.Router();

// Example users routes
router.get('/', (req, res) => {
  res.send('Users index');
});

router.get('/:id', (req, res) => {
  res.send(`User ${req.params.id}`);
});

module.exports = router;
