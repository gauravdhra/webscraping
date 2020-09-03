var express = require('express');
var router = express.Router();


//High courts routes
var usersRouter = require('./users');
var allahabadRouter = require('./allahabad');
var andhraPradeshRouter = require('./andhra-pradesh');
var bombayRouter = require('./bombay');
var delhiRouter = require('./delhi');
var calcuttaRouter = require('./calcutta');
var chhattisgarhRouter = require('./chhattisgarh');
var gujratRouter = require('./gujrat');
var himachalPradeshRouter = require('./himachal-pradesh');
var guwahatiRouter = require('./guwahati');
var jammuKashmirRouter = require('./jammu_kashmir');
var jharkhandRouter = require('./jharkhand');
var keralaRouter = require('./kerala');
var karnatakaRouter = require('./karnataka');
var madrasRouter = require('./madras');
var madhyaPradeshRouter = require('./madhya-pradesh');
var manipurRouter = require('./manipur');
var meghalayaRouter = require('./meghalaya');
var orissaRouter = require('./orissa');
var patnaRouter = require('./patna');
var rajasthanRouter = require('./rajasthan');
var rajasthanRouter = require('./rajasthan');
var sikkimRouter = require('./sikkim');
var telanganaRouter = require('./telangana');
var tripuraRouter = require('./tripura');
var uttarakhandRouter = require('./uttarakhand');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.use('/allahabad', allahabadRouter);
router.use('/andhra-pradesh', andhraPradeshRouter);
router.use('/bombay', bombayRouter);
router.use('/delhi', delhiRouter);
router.use('/calcutta', calcuttaRouter);
router.use('/chhattisgarh', chhattisgarhRouter);
router.use('/gujrat', gujratRouter);
router.use('/guwahati', guwahatiRouter);
router.use('/himachal-pradesh', himachalPradeshRouter);
router.use('/jammu-kashmir', jammuKashmirRouter);
router.use('/jharkhand', jharkhandRouter);
router.use('/karnataka', karnatakaRouter);
router.use('/kerala', keralaRouter);
router.use('/madhya-pradesh', madhyaPradeshRouter);
router.use('/madras', madrasRouter);
router.use('/manipur', manipurRouter);
router.use('/meghalaya', meghalayaRouter);
router.use('/orissa', orissaRouter);
router.use('/patna', patnaRouter);
router.use('/rajasthan', rajasthanRouter);
router.use('/sikkim', sikkimRouter);
router.use('/scrape', usersRouter);
router.use('/telangana', telanganaRouter);
router.use('/tripura', tripuraRouter);
router.use('/uttarakhand', uttarakhandRouter);



module.exports = router;
