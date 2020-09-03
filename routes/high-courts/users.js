var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
const axios = require('axios');
const qs = require('qs')
const puppeteer = require('puppeteer')
const { Proxy } = require("../../constants/courts-url");
var httpsProxyAgent = require("https-proxy-agent");


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/party', async function (req, res) {
  console.log('routed')
  var url = 'https://phhc.gov.in/home.php?search_param=pname';

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

  var config = {
    method: "POST",
    url,
    httpsAgent: agent,
    data: qs.stringify(searchByPartyName)
  };
  // axios.post(url, qs.stringify(searchByPartyName) )
  axios(config)
    .then(function (response) {
      console.log("response is: ")
      $ = cheerio.load(response.data);
      var listResponse = [];
      var headers = []
      console.log(1)
      $('#tables11 tbody tr').each(function (row) {
        console.log(2)
        if (row == 0) {
          $(this).find('th').each(function (index) {
            let text = $(this).text().trim();
            headers.push(text)
          })

        }
        if ($(this).hasClass('alt') || $(this).hasClass('alt2')) {
          let rowItems = []

          $(this).find('td').each(function (index) {
            let text = $(this).text().trim();
            rowItems.push(text)
          });
          listResponse.push(rowItems)
        }
      });

      res.send({ listResponse, headers, message: "Result Found" })
    })
    .catch(function (error) {
      console.log(3)
      console.log(error);
      res.send({ error })
    });

})
router.get('/advocate', function (req, res) {
  console.log(req.query.name)
  var url = 'https://phhc.gov.in/home.php?search_param=aname';

  if (req.query.adv_name != undefined)
    req.query = {
      select_name: "on",
      adv_name: req.query.adv_name,
      pet_or_res: "A",
      date_from: "",
      date_to: "",
      t_case_type: "",
      t_case_year: "",
      t_case_dist: "",
      submit: "Search Case",
    }

  if (req.query.adv_code != undefined)
    req.query = {
      select_code: "on",
      adv_code: req.query.adv_code,
      adv_number: req.query.adv_number,
      adv_year: req.query.adv_year,
      date_from: "",
      date_to: "",
      pet_or_res: "A",
      t_case_type: "",
      t_case_year: "",
      t_case_dist: "",
      submit: "Search Case"
    }

  const agent = new httpsProxyAgent(`http://${Proxy.username}:${Proxy.password}@${Proxy.IP}:${Proxy.port}`);

  var config = {
    method: "POST",
    url,
    httpsAgent: agent,
    data: qs.stringify(req.query)
  };
  axios(config)
    .then(function (response) {
      $ = cheerio.load(response.data);
      var listResponse = [];
      var headers = []

      $('#tables11 tbody tr').each(function (row) {
        if (row == 0) {
          $(this).find('th').each(function (index) {
            let text = $(this).text().trim();
            headers.push(text)
          })

        }
        if ($(this).hasClass('alt') || $(this).hasClass('alt2')) {
          let rowItems = []

          $(this).find('td').each(function (index) {
            let text = $(this).text().trim();
            rowItems.push(text)
          });
          listResponse.push(rowItems)
        }
      });
      res.send({ listResponse, headers, message: "Result Found" })
    })
    .catch(function (error) {
      console.log(error);
      res.send(error)
    });

})
router.get('/case', function (req, res) {
  console.log(req.query.name)
  var url = 'https://phhc.gov.in/home.php?search_param=case';

  let searchByCaseNumber = {
    "t_case_type": req.query.t_case_type,
    "t_case_no": req.query.t_case_no,
    "t_case_year": req.query.t_case_year,
    "submit": "Search Case"
  }

  const agent = new httpsProxyAgent(`http://${Proxy.username}:${Proxy.password}@${Proxy.IP}:${Proxy.port}`);

  var config = {
    method: "POST",
    url,
    httpsAgent: agent,
    data: qs.stringify(searchByCaseNumber)
  };
  axios(config)
    .then(function (response) {
      $ = cheerio.load(response.data);
      var listResponse = [];
      var headers = []

      $('#tables11 tbody tr').each(function (row) {
        if (row == 1) {
          $(this).find('th').each(function (index) {
            let text = $(this).text().trim();
            headers.push(text)
          })

        }
        if ($(this).hasClass('alt') || $(this).hasClass('alt2')) {
          let rowItems = []

          $(this).find('td').each(function (index) {
            let text = $(this).text().trim();
            rowItems.push(text)
          });
          listResponse.push(rowItems)
        }
      });
      res.send({ listResponse, headers, message: "Result Found" })
    })
    .catch(function (error) {
      console.log(error);
      res.send(error)
    });


})
router.get('/cnr', function (req, res) {
  console.log(req.query.name)
  var url = 'https://phhc.gov.in/home.php?search_param=lac';


  let searchByCNRNumber = {
    "t_lac_dist": req.query.t_lac_dist,
    "t_lac_no": req.query.t_lac_no,
    "t_lac_date": req.query.t_lac_date,
    "submit": "Search Case"
  }

  const agent = new httpsProxyAgent(`http://${Proxy.username}:${Proxy.password}@${Proxy.IP}:${Proxy.port}`);

  var config = {
    method: "POST",
    url,
    httpsAgent: agent,
    data: qs.stringify(searchByCNRNumber)
  };
  axios(config)
    .then(function (response) {
      $ = cheerio.load(response.data);
      var listResponse = [];
      var headers = []

      $('#tables11 tbody tr').each(function (row) {
        if (row == 1) {
          $(this).find('th').each(function (index) {
            let text = $(this).text().trim();
            headers.push(text)
          })

        }
        if ($(this).hasClass('alt') || $(this).hasClass('alt2')) {
          let rowItems = []

          $(this).find('td').each(function (index) {
            let text = $(this).text().trim();
            rowItems.push(text)
          });
          listResponse.push(rowItems)
        }
      });
      res.send({ listResponse, headers, message: "Result Found" })
    })
    .catch(function (error) {
      console.log(error);
      res.send(error)
    });


})


module.exports = router;
