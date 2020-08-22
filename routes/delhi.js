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
    var goToURL = URL.DELHI

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.setViewport({ width: 1500, height: 1400 })

    await page.setDefaultNavigationTimeout(0);
    await page.goto(goToURL)

    await page.waitForSelector('button[type ="submit"]')

    await page.select('.pet-case-form #pyear', req.query.pyear)
    await page.type('.pet-case-form #party', req.query.party)


    const captchaCode = await page.$eval('#hiddeninputdigit', el => el.value)

    await page.type('.pet-case-form #inputdigit', captchaCode)

    await page.click('.pet-case-form button[type ="submit"]')

    await page.setDefaultNavigationTimeout(0);


    await page.waitForSelector('#InnerPageContent ul li', { timeout: 60000 })

    const finalData = await page.evaluate(() => document.querySelector('#InnerPageContent').outerHTML);


    $ = cheerio.load(finalData);
    var listResponse = [];
    var headers = []

    $("#InnerPageContent h6").find('span').each(function (index) {
      let text = $(this).text().trim();
      headers.push(text)
    })
    $('#InnerPageContent ul li').each(function (row) {

      let rowItems = []

      $(this).find('span').each(function (index) {
        let text = $(this).text()
        rowItems.push(text)
      });
      listResponse.push(rowItems)
    });

    res.send({ listResponse, headers ,message:"Result Found"})
  }
  catch (error) {
    next(error)
  }

})



router.get('/advocate', async function (req, res, next) {
  try {
    console.log("entered endpoint")
    var goToURL = URL.DELHI

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })

    await page.setDefaultNavigationTimeout(0);
    await page.goto(goToURL)

    await page.waitForSelector('button[type ="submit"]')

    await page.select('.case-advocate-type #ayear', req.query.ayear)
    await page.type('.case-advocate-type #adv', req.query.adv)


    const captchaCode = await page.$eval('#hiddeninputdigit', el => el.value)

    await page.type('.case-advocate-type #inputdigit', captchaCode)

    await page.click('.case-advocate-type button[type ="submit"]')

    await page.setDefaultNavigationTimeout(0);


    await page.waitForSelector('#InnerPageContent ul li', { timeout: 60000 })

    const finalData = await page.evaluate(() => document.querySelector('#InnerPageContent').outerHTML);


    $ = cheerio.load(finalData);
    var listResponse = [];
    var headers = []

    $("#InnerPageContent h6").find('span').each(function (index) {
      let text = $(this).text().trim();
      headers.push(text)
    })
    $('#InnerPageContent ul li').each(function (row) {

      let rowItems = []

      $(this).find('span').each(function (index) {
        let text = $(this).text()
        rowItems.push(text)
      });
      listResponse.push(rowItems)
    });

    res.send({ listResponse, headers ,message:"Result Found"})
  }
  catch (error) {
    next(error)
  }

})



router.get('/case-number', async function (req, res, next) {
  try {
    console.log("entered endpoint")
    var goToURL = URL.DELHI

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })

    await page.setDefaultNavigationTimeout(0);
    await page.goto(goToURL)

    await page.waitForSelector('button[type ="submit"]')

    const captchaCode = await page.$eval('#hiddeninputdigit', el => el.value)

    await page.select(".case-type-form select[name='cyear']", req.query.cyear)
    await page.type(".case-type-form input[name='cno']", req.query.cno)

    await page.type('.case-type-form #inputdigit', captchaCode)

    await page.click('.case-type-form button[type ="submit"]')

    await page.waitForSelector('#InnerPageContent ul li', { timeout: 60000 })

    const finalData = await page.evaluate(() => document.querySelector('#InnerPageContent').outerHTML);


    $ = cheerio.load(finalData);
    var listResponse = [];
    var headers = []
    
    $("#InnerPageContent h6").find('span').each(function (index) {
      let text = $(this).text().trim();
      headers.push(text)
    })

    $('#InnerPageContent ul li').each(function (row) {

      let rowItems = []

      $(this).find('span').each(function (index) {
        let text = $(this).text()
        rowItems.push(text)
      });
      listResponse.push(rowItems)
    });

    res.send({ listResponse, headers ,message:"Result Found"})
  }
  catch (error) {
    next(error)
  }

})








module.exports = router;
