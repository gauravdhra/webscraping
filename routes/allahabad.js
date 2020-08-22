var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
const axios = require('axios');
const qs = require('qs')
const puppeteer = require('puppeteer')
const { URL } = require("../constants/courts-url");



router.get('/party', async function (req, res, next) {
  try {
    console.log("entered endpoint")
    var goToURL = URL.ALLAHABAD_PARTY

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })

    await page.setDefaultNavigationTimeout(0);
    await page.goto(goToURL)
    console.log('1')

    await page.waitForSelector('#go_btn')
    await page.select('#party_type', req.query.party_type)
    await page.type('#party_name', req.query.party_name)
    await page.type('#from_year', req.query.from_year)

    const element = await page.$("#captcha_img");
    let captchaCode = await page.evaluate(element => element.innerText, element);
    await page.type('#captchacode', captchaCode)
    console.log('2')

    await page.waitForSelector('#go_btn')

    await page.click('#go_btn')
    await page.setDefaultNavigationTimeout(0);
    console.log('3')

    await page.waitForSelector('#CaseInfoData table',{timeout:60000})

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
    await browser.close();
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
    //    await browser.close();console.log(error);
    //   res.send({error})
    // });

  }
  catch (error) {
    next(error)
  }

})





router.get('/advocate', async function (req, res, next) {
  try {
    console.log("entered endpoint")
    var goToURL = URL.ALLAHABAD_ADVOCATE

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()

    await page.setDefaultNavigationTimeout(0);
    await page.goto(goToURL)

    await page.waitForSelector('#go_btn')

    await page.type('#adv_roll', req.query.adv_roll)

    const element = await page.$("#captcha_img");
    let captchaCode = await page.evaluate(element => element.innerText, element);
    await page.type('#captchacode', captchaCode)
    console.log('2')

    await page.click('#go_btn')
    await page.setDefaultNavigationTimeout(0);
    console.log('3')

    await page.waitForSelector('#CaseInfoData table')

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
    await browser.close();
    res.send({ headers: headers, listResponse: listResponse })
  }
  catch (error) {
    next(error)
  }
})


router.get('/case-number', async function (req, res, next) {
  try {
    console.log("entered endpoint")
    var goToURL = URL.ALLAHABAD_CASE

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()

    await page.setDefaultNavigationTimeout(0);
    await page.goto(goToURL)

    await page.waitForSelector('#go_btn')
    await page.select('#case_type', req.query.case_type)
    await page.type('#case_no', req.query.case_no)
    await page.type('#case_year', req.query.case_year)

    const element = await page.$("#captcha_img");
    let captchaCode = await page.evaluate(element => element.innerText, element);
    await page.type('#captchacode', captchaCode)
    console.log('2')

    await page.click('#go_btn')
    await page.setDefaultNavigationTimeout(0);
    console.log('3')

    await page.waitForSelector('#CaseInfoData table')

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
    await browser.close();
    res.send({ headers: headers, listResponse: listResponse })
  }
  catch (error) {
    next(error)
  }
})


module.exports = router;
