var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
const axios = require('axios');
const qs = require('qs')
const puppeteer = require('puppeteer')
const { Proxy } = require("../../constants/courts-url");

const { URL, AntiCaptcha } = require("../../constants/courts-url");
var anticaptcha = require('../../anticaptcha/anticaptcha')(AntiCaptcha.key);


router.get('/', async function (req, res, next) {

  try {
    var base64Image = ""
    console.log("entered railway endpoint")

    const browser = await puppeteer.launch({ headless: true, args: [ '--no-sandbox'] })

    const page = await browser.newPage()
    // await page.authenticate({
    //   username: Proxy.username,
    //   password: Proxy.password
    // });
    await page.setViewport({ width: 1280, height: 800 })

    var getToUrl = URL.RAILWAY_TRIBUNAL

    page.goto(getToUrl)

    await page.waitForSelector('input[type ="submit"]')


    await page.select('select[name=casetype]', req.query.casetype)
    await page.select('select[name="rct"]', req.query.rct)
    await page.type('input[name=caseno]', req.query.caseno)
    await page.select('select[name=year]', req.query.year)


    await page.click('input[type ="submit"]')

    // Now see which one appeared:
    await page.waitForSelector("body  table[width='550'] tbody tr", { timeout: 30000 });

    const tableData = await extractDataFromTable("body table[width='550']", page);

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

  // $(tableId + ' thead tr').find('th').each(function (index) {
  //   let text = $(this).text().trim();
  //   headers.push(text)
  // })
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
