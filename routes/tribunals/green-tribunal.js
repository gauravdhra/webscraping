var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
const axios = require('axios');
const qs = require('qs')
const puppeteer = require('puppeteer')
const { Proxy } = require("../../constants/courts-url");

const { URL, AntiCaptcha } = require("../../constants/courts-url");
var anticaptcha = require('../../anticaptcha/anticaptcha')(AntiCaptcha.key);


router.get('/party', async function (req, res, next) {

  try {
    var base64Image = ""
    console.log("entered endpoint")

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })

    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });;
    await page.setViewport({ width: 1280, height: 800 })

    var getToUrl = URL.TRIBUNAL_PARTY

    page.goto(getToUrl, { "waitUntil": "networkidle0" })

    await page.waitForSelector('button[type ="submit"]')

    const captchaCode = await page.$eval('#mainCaptcha', el => el.textContent)


    console.log("taskSolution", captchaCode);

    await page.select('select[name=zone_type]', req.query.zone_type)
    await page.select('select[name=party_type]', req.query.party_type)
    await page.type('#partyname', req.query.partyname)

    await page.type('#txtInput', captchaCode)

    await page.click('button[type ="submit"]')

    // Now see which one appeared:
    await page.waitForSelector("#block-system-main table.customtable tbody tr", { timeout: 30000 });

    const tableData = await extractDataFromTable("#block-system-main table.customtable", page);

    await browser.close();

    res.send({ listResponse: tableData.listResponse, headers: tableData.headers, message: "Result Found" })



  }
  catch (error) {
    next(error)
  }
})

router.get('/advocate', async function (req, res, next) {

  try {
    var base64Image = ""
    console.log("entered endpoint")

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })

    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });;
    await page.setViewport({ width: 1280, height: 800 })

    var getToUrl = URL.TRIBUNAL_ADVOCATE

    page.goto(getToUrl, { "waitUntil": "networkidle0" })

    await page.waitForSelector('button[type ="submit"]')

    const captchaCode = await page.$eval('#mainCaptcha', el => el.textContent)


    console.log("taskSolution", captchaCode);

    await page.select('select[name=zone_type]', req.query.zone_type)
    await page.select('select[name=party_type]', req.query.party_type)
    await page.type('#advocatename', req.query.advocatename)

    await page.type('#txtInput', captchaCode)

    await page.click('button[type ="submit"]')

    // Now see which one appeared:
    await page.waitForSelector("#block-system-main table.customtable tbody tr", { timeout: 30000 });

    const tableData = await extractDataFromTable("#block-system-main table.customtable", page);

    await browser.close();

    res.send({ listResponse: tableData.listResponse, headers: tableData.headers, message: "Result Found" })



  }
  catch (error) {
    next(error)
  }
})










router.get('/case-number', async function (req, res, next) {

  try {
    var base64Image = ""
    console.log("entered endpoint")

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })

    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });;
    await page.setViewport({ width: 1280, height: 800 })

    var getToUrl = URL.TRIBUNAL_CASE

    page.goto(getToUrl, { "waitUntil": "networkidle0" })

    await page.waitForSelector('button[type ="submit"]')

    const captchaCode = await page.$eval('#mainCaptcha', el => el.textContent)


    console.log("taskSolution", captchaCode);

    await page.select('select[name="zone_type"]', req.query.zone_type)
    await page.select('select[name="case_type"]', req.query.case_type)
    await page.type('#casenumber', req.query.casenumber)
    await page.type('select[name="case_year"]', req.query.case_year)

    await page.type('#txtInput', captchaCode)

    await page.click('button[type ="submit"]')

    // Now see which one appeared:
    await page.waitForSelector("#block-system-main table.customtable tbody tr", { timeout: 30000 });

    const tableData = await extractDataFromTable("#block-system-main table.customtable", page);

    await browser.close();

    res.send({ listResponse: tableData.listResponse, headers: tableData.headers, message: "Result Found" })



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



async function extractDataFromTable(tableId, page) {
  let $ = cheerio.load(await page.evaluate(() => document.body.innerHTML));

  console.log('5')
  var listResponse = [];
  var headers = []

  $(tableId + ' thead tr').find('th').each(function (index) {
    let text = $(this).text().trim();
    headers.push(text)
  })
  $(tableId + ' tbody tr').each(function (row) {
    let rowItems = []

    $(this).find('td').each(function (index) {
      let text = $(this).text().trim();
      rowItems.push(text)
    });
    listResponse.push(rowItems)
  })
  return { listResponse, headers }
}



module.exports = router;
