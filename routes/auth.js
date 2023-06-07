var express = require('express');
var router = express.Router();

router.post('/signup', function(req, res, next) {
    console.log(req.body)
    const hah = {
        user: 1,
        body: req.body

    }
    res.json(hah);
});



module.exports = router;