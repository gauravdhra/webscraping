var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
const axios = require('axios');
const qs = require('qs')
const puppeteer = require('puppeteer')
const { Proxy } = require("../../constants/courts-url");

const { URL } = require("../../constants/courts-url");


router.get('/party', async function (req, res, next) {
  try {
    console.log("entered endpoint")
    var goToURL = URL.CALCUTTA

    const browser = await puppeteer.launch({
      headless: true, 
      ignoreHTTPSErrors: true,
      args: [
        `--proxy-server=http://${Proxy.IP}:${Proxy.port}`, `--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'
      ]
    })
    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });

    await page.setViewport({ width: 1600, height: 1600 })

    await page.setDefaultNavigationTimeout(0);
    await page.goto(goToURL)

    await page.waitForSelector('button[type="submit"]')

    await page.type('#pet_name', req.query.pet_name)

    await delay(500)

    await page.click('button[type="submit"]')

    await page.waitForSelector('#result-div #row-0', { timeout: 36000 })


    const finalData = await page.evaluate(() => document.querySelector('#result-div').outerHTML);
    await browser.close();
    res.send({ table: finalData })

  }
  catch (error) {
    next(error)
  }
})

router.get('/advocate', async function (req, res, next) {
  try {
    console.log("entered endpoint")
    var goToURL = URL.CALCUTTA

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })
    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });

    await page.setDefaultNavigationTimeout(0);
    await page.goto(goToURL)

    await page.waitForSelector('#search-button')

    await page.type('#pet_adv', req.query.pet_adv)

    await delay(500)

    await page.click('#search-button')
    await page.setDefaultNavigationTimeout(0);
    await page.waitwaitForSelectorFor('#result-div #row-0')


    const finalData = await page.evaluate(() => document.querySelector('#result-div').outerHTML);
    await browser.close();
    res.send({ table: finalData })

  }
  catch (error) {
    next(error)
  }
})


router.get('/case-number', async function (req, res, next) {
  try {
    console.log("entered endpoint")
    var goToURL = URL.CALCUTTA

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })
    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });

    await page.setDefaultNavigationTimeout(0);
    await page.goto(goToURL)

    await page.waitForSelector('#search-button')

    await page.type('#case_no', req.query.case_no)

    await delay(500)
    await page.click('#search-button')
    await page.setDefaultNavigationTimeout(0);
    await page.waitForSelector('#result-div #row-0')


    const finalData = await page.evaluate(() => document.querySelector('#result-div').outerHTML);
    await browser.close();
    res.send({ table: finalData })

  }
  catch (error) {
    next(error)
  }
})




function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}





module.exports = router;
