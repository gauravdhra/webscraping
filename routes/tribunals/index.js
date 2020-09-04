var express = require('express');
var router = express.Router();


//High courts routes
var greenTribunalRouter = require('./green-tribunal');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.use('/green-tribunal', greenTribunalRouter);


module.exports = router;
