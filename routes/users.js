var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
const axios = require('axios');
const qs = require('qs')
const puppeteer = require('puppeteer')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/party', async function (req, res) {
  console.log('routed')
  var url = 'https://highcourtofuttarakhand.gov.in';
  // var url = 'http://www.allahabadhighcourt.in/apps/status/index.php/party-name';

  const browser = await puppeteer.launch({ headless: true,args: ['--no-sandbox'] })
  const page = await browser.newPage()
  // await page.setViewport({ width: 1280, height: 800 })
  await page.setDefaultNavigationTimeout(0);
  console.log('0')
  await page.goto(url)
  console.log('0.5')
  await page.screenshot({ path: 'example.png' })

  await page.waitForSelector('#tables_input')

  console.log('1')
  await page.type('#pet_name', req.query.pet_name)


  // await page.waitForSelector('#go_btn')
  // await page.select('#party_type', 'pet')
  // await page.type('#party_name', 'suresh')
  // await page.type('#from_year', '2019')

  // const element = await page.$("#captcha_img");
  // let captchaCode = await page.evaluate(element => element.innerText,element);
  
  // await page.type('#captchacode', captchaCode)
  console.log('2')
  await page.setDefaultNavigationTimeout(0);

  // await page.click('#go_btn')
  await page.click('input[type="submit"]')

  await page.screenshot({ path: 'example.png' })

  console.log('3')

  await page.waitForSelector('#tables11')

    var listResponse = [];
    var headers =[]
    let $ = cheerio.load(await page.evaluate(() => document.body.innerHTML));

  $('#tables11 tbody tr').each(function (row) {
      console.log(2)
      if(row == 0){
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
    })

  res.send({headers:headers,listResponse:listResponse})





  // axios.post(url, qs.stringify(req.query) )
  // // axios({
  // //   method: 'post',
  // //   url: url,
  // //   responseType: 'text/html',
  // //   timeout: 20000,
  // //   params:  qs.stringify(req.query)
  // //   })
  //   .then(function (response) {
  //     console.log("response is: ")
  //     console.log(response)
  //   $ = cheerio.load(response.data);
  //   var listResponse = [];
  //   var headers =[]
  //   console.log(1)
  //   $('#tables11 tbody tr').each(function (row) {
  //     console.log(2)
  //     if(row == 0){
  //       $(this).find('th').each(function (index) {
  //       let text = $(this).text().trim();
  //       headers.push(text)
  //     })

  //     }
  //     if ($(this).hasClass('alt') || $(this).hasClass('alt2')) {
  //       let rowItems = []
 
  //       $(this).find('td').each(function (index) {
  //         let text = $(this).text().trim();
  //         rowItems.push(text)
  //       });
  //       listResponse.push(rowItems)
  //     }
  //   });

  //   res.send({listResponse,headers})
  // })
  // .catch(function (error) {
  //   console.log(3)
  //   console.log(error);
  //   res.send({error})
  // });

})
router.get('/advocate', function (req, res) {
console.log(req.query.name)
  var url = 'https://phhc.gov.in/home.php?search_param=aname';



  axios.post(url, qs.stringify(req.query) )
  .then(function (response) {
    $ = cheerio.load(response.data);
    var listResponse = [];
    var headers =[]

    $('#tables11 tbody tr').each(function (row) {
      if(row == 0){
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
    res.send({listResponse,headers})
  })
  .catch(function (error) {
    console.log(error);
    res.send(error)
  });

})
router.get('/case', function (req, res) {
console.log(req.query.name)
  var url = 'https://phhc.gov.in/home.php?search_param=case';


  axios.post(url, qs.stringify(req.query) )
  .then(function (response) {
    $ = cheerio.load(response.data);
    var listResponse = [];
    var headers =[]

    $('#tables11 tbody tr').each(function (row) {
      if(row == 1){
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
    res.send({listResponse,headers})
  })
  .catch(function (error) {
    console.log(error);
    res.send(error)
  });


})
router.get('/cnr', function (req, res) {
console.log(req.query.name)
  var url = 'https://phhc.gov.in/home.php?search_param=lac';

  axios.post(url, qs.stringify(req.query) )
  .then(function (response) {
    $ = cheerio.load(response.data);
    var listResponse = [];
    var headers =[]

    $('#tables11 tbody tr').each(function (row) {
      if(row == 1){
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
    res.send({listResponse,headers})
  })
  .catch(function (error) {
    console.log(error);
    res.send(error)
  });


})


module.exports = router;
