var express = require('express');
var router = express.Router();


//High courts routes
var electricityTribunalRouter = require('./electricity-tribunal');
var greenTribunalRouter = require('./green-tribunal');
var railwayTribunalRouter = require('./railway-tribunal');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.use('/electricity-tribunal', electricityTribunalRouter);
router.use('/green-tribunal', greenTribunalRouter);
router.use('/railway-tribunal', railwayTribunalRouter);


module.exports = router;
