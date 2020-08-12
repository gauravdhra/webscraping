var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var CourtsUrl = require('constants');
const axios = require('axios');
const qs = require('qs')
const puppeteer = require('puppeteer')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/allahabad', async function (req, res) {

  console.log("entered endpoint")
  // if(req.query.state == ''){
  //   var url = CourtsUrl.DELHI_COURT

  // }

  // if(req.query.state == ''){

  // }

  // if(req.query.state == ''){

  // }

  var getFormUrl = 'http://www.allahabadhighcourt.in/apps/status/index.php/party-name';
  var url = 'http://www.allahabadhighcourt.in/apps/status/index.php/get_CaseInfo_party';
  var captcha = ""



  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'], })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })

  await page.setDefaultNavigationTimeout(0);
  await page.goto(getFormUrl)
  console.log('1')

  await page.waitForSelector('#go_btn')
  await page.select('#party_type', req.query.party_type)
  await page.type('#party_name', req.query.party_name)
  await page.type('#from_year', req.query.from_year)

  const element = await page.$("#captcha_img");
  let captchaCode = await page.evaluate(element => element.innerText, element);
  await page.type('#captchacode', captchaCode)
  console.log('2')

  await page.click('#go_btn')
  await page.setDefaultNavigationTimeout(0);
  console.log('3')

  await page.waitForSelector('#CaseInfoData table')

  // await page.screenshot({ path: 'example.png' })
  var listResponse = [];
  var headers = []
  console.log('4')
  
  let $ = cheerio.load(await page.evaluate(() => document.body.innerHTML));
  
  console.log('5')
  
  $('#CaseInfoData table thead tr').find('th').each(function (index) {
    let text = $(this).text().trim();
    headers.push(text)
  })
  $('#CaseInfoData table tbody tr').each(function (row) {
      let rowItems = []

      $(this).find('td').each(function (index) {
        let text = $(this).text().trim();
        rowItems.push(text)
      });
      listResponse.push(rowItems)
  })

  res.send({ headers: headers, listResponse: listResponse })



  // captcha number 
  // var result = await axios.get(getFormUrl)
  // .then(function (response) {
  //   $ = cheerio.load(response.data);
  //   captcha = $('#captcha_img').text().trim();
  // })
  // .catch(function (error) {
  //   console.log(error);
  // })

  // req.query.captchacode = parseInt(captcha)
  // console.log("req.query.captchacode",req.query.captchacode)
  // axios.post(url, qs.stringify(req.query) )
  //   .then(function (response) {
  //     console.log("response is: ")
  //     console.log(response.data)
  //   $ = cheerio.load(response.data);
  //   var listResponse = [];
  //   var headers =[]
  //   console.log(1)
  //   $('table tbody tr').each(function (row) {
  //     console.log(2)
  //     if(row == 0){
  //     //   $(this).find('th').each(function (index) {
  //     //   let text = $(this).text().trim();
  //     //   headers.push(text)
  //     // })

  //     }
  //       let rowItems = []

  //       $(this).find('td').each(function (index) {
  //         let text = $(this).text().trim();
  //         rowItems.push(text)
  //       });
  //       listResponse.push(rowItems)
  //   });

  //   res.send({listResponse,headers})
  // })
  // .catch(function (error) {
  //   console.log(3)
  //   console.log(error);
  //   res.send({error})
  // });



})



module.exports = router;
