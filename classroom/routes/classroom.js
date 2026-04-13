const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
    const { name } = req.query;
    if (name && name.trim().length > 0) {
        req.session.name = name.trim();
        req.flash('success', 'user registered successfully!');
    } else {
        req.flash('error', 'user not registered');
    }
    res.redirect('/hello');
});

router.get('/hello', (req, res) => {
    const name = req.session.name || 'anonymous';
    const successMsg = req.flash('success');
    const errorMsg = req.flash('error');
    res.render('page.ejs', { name, successMsg, errorMsg });
});

module.exports = router;
