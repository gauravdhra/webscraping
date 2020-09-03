var express = require('express');
var router = express.Router();
const axios = require('axios');
const qs = require('qs')
const { Proxy } = require("../../constants/courts-url");
var httpsProxyAgent = require("https-proxy-agent");


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/getpolicestations', async function (req, res) {
  console.log('routed')
  var url = 'http://59.180.234.21:8080/citizen/getfirsearchpolicestations.htm';


  const agent = new httpsProxyAgent(`http://${Proxy.username}:${Proxy.password}@${Proxy.IP}:${Proxy.port}`);
  var config = {
    method: "POST",
    url,
    httpsAgent: agent,
    data: qs.stringify(req.query)
  };
  axios(config)
    .then(function (response) {
      res.send({ stations: response.data,  message: "Result Found" })

    })
    .catch(function (error) {
      console.log(3)
      console.log(error);
      res.send({ error })
    });

})

router.get('/FIR', async function (req, res) {
  console.log('routed')
  var url = 'http://59.180.234.21:8080/citizen/regfirsearchpage.htm';

  let searchByPartyName = {
    pet_name: req.query.pet_name,
    pet_or_res: "A",
    date_from: "",
    date_to: "",
    t_case_type: "",
    t_case_year: "",
    t_case_dist: "",
    submit: "Search Case",
  }

  const agent = new httpsProxyAgent(`http://${Proxy.username}:${Proxy.password}@${Proxy.IP}:${Proxy.port}`);
  req.query['radioValue']=undefined
  var config = {
    method: "POST",
    url,
    httpsAgent: agent,
    data: qs.stringify(req.query)
  };
  axios(config)
    .then(function (response) {
      console.log("response is: ")
      res.send({ listResponse:response.data, message: "Result Found" })

    },err=>{
      res.send({ err })
    })
    .catch(function (error) {
      console.log(3)
      console.log(error);
      res.send({ error })
    });

})



module.exports = router;
