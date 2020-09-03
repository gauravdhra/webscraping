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
    var goToURL = URL.KARNATAKA_PARTY

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })
    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });
    await page.setViewport({ width: 1280, height: 800 })

    await page.setDefaultNavigationTimeout(0);
    await page.goto(goToURL)
    console.log('1')

    await page.waitForSelector('input[name ="submit"]')

    await page.type('input[name ="search_name"]', req.query.petres_name)
    await page.$eval('#from_date', (el,date) => el.value = date,req.query.from_date);
    await page.$eval('#to_date', (el,date) => el.value = date,req.query.to_date);



    await page.click('input[name ="submit"]')
    await page.setDefaultNavigationTimeout(0);
    console.log('3')

    await page.waitForSelector('table tbody tr',{timeout:60000})


    let tableData = await extractDataFromTable("table", page)
    res.send({ listResponse:tableData.listResponse, headers:tableData.headers ,message :"Result Found" })
    // return { listResponse, headers }

    // const finalData = await page.evaluate(() => document.querySelector('table').outerHTML);
    
    // await browser.close();
    // res.send({ listResponse, headers })



  }
  catch (error) {
    next(error)
  }

})





router.get('/advocate', async function (req, res, next) {
  try {
    console.log("entered endpoint")
    var goToURL = URL.KARNATAKA_ADVOCATE

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })
    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });
    await page.setViewport({ width: 1280, height: 800 })

    await page.setDefaultNavigationTimeout(0);
    await page.goto(goToURL)
    console.log('1')

    await page.waitForSelector('input[name ="submit"]')

    await page.type('input[name ="search_name"]', req.query.petres_name)
    await page.$eval('#from_date', (el,date) => el.value = date,req.query.from_date);
    await page.$eval('#to_date', (el,date) => el.value = date,req.query.to_date);



    await page.click('input[name ="submit"]')
    await page.setDefaultNavigationTimeout(0);
    console.log('3')

    await page.waitForSelector('table tbody tr',{timeout:60000})



    let tableData = await extractDataFromTable("table", page)
    res.send({ listResponse:tableData.listResponse, headers:tableData.headers ,message :"Result Found" })
    
    // const finalData = await page.evaluate(() => document.querySelector('table').outerHTML);
    // await browser.close();
    // res.send({ table: finalData })

  }
  catch (error) {
    next(error)
  }
})


router.get('/case-number', async function (req, res, next) {
  try {
    console.log("entered endpoint")
    var goToURL = URL.KARNATAKA_CASE

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })
    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });
    await page.setViewport({ width: 1280, height: 800 })

    await page.setDefaultNavigationTimeout(0);
    await page.goto(goToURL)
    console.log('1')

    await page.waitForSelector('input[name ="submit"]')

    await page.select('select[name ="case_types"]', req.query.case_type)
    await page.type('input[name ="case_no"]', req.query.search_case_no)
    await page.type('input[name ="case_year"]', req.query.rgyear)
    // await page.$eval('#from_date', (el,date) => el.value = date,req.query.from_date);
    // await page.$eval('#to_date', (el,date) => el.value = date,req.query.to_date);



    await page.click('input[name ="submit"]')
    await page.setDefaultNavigationTimeout(0);
    console.log('3')

    await page.waitForSelector('table tbody tr',{timeout:60000})



    const finalData = await page.evaluate(() => document.querySelector('table').outerHTML);
    
    await browser.close();
    res.send({ table: finalData })

  }
  catch (error) {
    next(error)
  }
})


async function extractDataFromTable(element, page) {
  let $ = cheerio.load(await page.evaluate(() => document.body.innerHTML));

  console.log('5')
  var listResponse = [];
  var headers = []

  $(element + ' tbody tr').find('th').each(function (index) {
    let text = $(this).text().trim();
    headers.push(text)
  })
  $(element + ' tbody tr').each(function (row) {
    let rowItems = []
    if(row == 0 ) return;
    $(this).find('td').each(function (index) {
      let text = $(this).text().trim();
      rowItems.push(text)
    });
    listResponse.push(rowItems)
  })
  return { listResponse, headers }
}

module.exports = router;
