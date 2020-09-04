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
    console.log("supreme endpoint")

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })

    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });
    await page.setViewport({ width: 1280, height: 800 })

    var getToUrl = URL.SUPREME_COURT

    await getBase64Image(page, getToUrl, next).then((image) => {
      base64Image = image;
    }, err => {
      next(err);
    })

    console.log("jumpppp ")
    getCaptchText(base64Image).then(async (text) => {
      try {
        console.log("taskSolution", text);
        await page.click('.z-tabs-desktop li:nth-child(3)')

        await page.waitForSelector("#ansCaptcha");

        await page.type('#partyname', req.query.partyname)
        await page.select('#partyyear', req.query.partyyear)
        await page.type('#ansCaptcha', text)

        await page.click('#getPartyData')

        // Now see which one appeared:
        try {
          await page.waitForSelector("#PNdisplay #cj  tbody tr:nth-child(2)", { timeout: 30000 });

          const tableData = await extractDataFromTable("cj", page);

          await browser.close();

          res.send({ listResponse: tableData.listResponse, headers: tableData.headers, message: "Result Found" })
        }
        catch (err) {
          //check for "not found" 
          let ErrMsg = await page.evaluate((sel) => {
            let element = document.querySelector(sel);
            return element ? element.title : null;
          }, "#txtmsg");

          console.log(ErrMsg)

          if (ErrMsg) {
            await browser.close();
            res.send({ message: ErrMsg })
          } else {
            await page.waitForSelector('#showList3 tbody tr', { timeout: 30000 })

            const tableData = await extractDataFromTable("showList3", page);

            await browser.close();

            res.send({ listResponse: tableData.listResponse, headers: tableData.headers, message: "Result Found" })
          }
        }
      }
      catch (err) {
        next(err)
      }
    }, err => {
      next(err)
    })


  }
  catch (error) {
    next(error)
  }
})

router.get('/case-number', async function (req, res, next) {

  try {
    var base64Image = ""
    console.log("supreme endpoint")

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })

    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });;
    await page.setViewport({ width: 1280, height: 800 })

    var getToUrl = URL.SUPREME_COURT

    await getBase64Image(page, getToUrl, next).then((image) => {
      base64Image = image;
    }, err => {
      next(err);
    })


    getCaptchText(base64Image).then(async (text) => {
      try {
        console.log("taskSolution", text);
        await page.click('.z-tabs-desktop li:nth-child(2)')

        await page.waitForSelector("#ansCaptcha");

        await page.select('#case_type', req.query.case_type)
        await page.type('#CaseNumber', req.query.CaseNumber)
        await page.select('#CaseYear', req.query.CaseYear)
        await page.type('#ansCaptcha', text)

        await page.click('#getCaseData')

        // Now see which one appeared:
        try {
          await page.waitForSelector("#PNdisplay #cj  tbody tr:nth-child(2)", { timeout: 30000 });

          const tableData = await extractDataFromTable("cj", page);

          await browser.close();

          res.send({ listResponse: tableData.listResponse, headers: tableData.headers, message: "Result Found" })
        }
        catch (err) {
          //check for "not found" 
          let ErrMsg = await page.evaluate((sel) => {
            let element = document.querySelector(sel);
            return element ? element.title : null;
          }, "#txtmsg");

          console.log(ErrMsg)

          if (ErrMsg) {
            await browser.close();
            res.send({ message: ErrMsg })
          } else {
            await page.waitForSelector('#showList #titlehid tbody tr', { timeout: 30000 })

            const tableData = await extractDataFromTable("titlehid", page);

            await browser.close();

            res.send({ listResponse: tableData.listResponse, headers: tableData.headers, message: "Result Found" })
          }
        };

      }
      catch (err) {
        next(err)
      }
    }, err => {
      next(err)
    })


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

async function getBase64Image(page, getToUrl, next) {

  return new Promise(async function (resolve, reject) {
    try {

      await page.setDefaultNavigationTimeout(0);

      page.goto(getToUrl, { "waitUntil": "networkidle0" })

      await delay(1000);
      await page.waitForSelector('#captcha')

      let captchaImage = await page.$("#captcha ");

      console.log("Image start.");

      let base64Image = await captchaImage.screenshot({ encoding: "base64" });

      resolve(base64Image)
      console.log("Image end.");
    }
    catch (error) {
      next(error)
    }
  });

}


async function extractDataFromTable(tableId, page) {
  let $ = cheerio.load(await page.evaluate(() => document.body.innerHTML));

  console.log('5')
  var listResponse = [];
  var headers = []

  $('#' + tableId + ' tbody tr:nth-child(1)').find('td').each(function (index) {
    let text = $(this).text().trim();
    headers.push(text)
  })
  $('#' + tableId + ' tbody tr').each(function (row) {
    let rowItems = []

    if (row > 0) {

      $(this).find('td').each(function (index) {
        let text = $(this).text().trim();
        rowItems.push(text)
      });
      listResponse.push(rowItems)
    }

  })
  return { listResponse, headers }
}
function getCaptchText(base64Image) {
  return new Promise(function (resolve, reject) {

    anticaptcha.getBalance(function (err, balance) {
      if (err) {
        reject(err)
      }

      // captcha params can be set here
      // anticaptcha.setMinLength(5);

      if (balance > 0) {
        anticaptcha.createImageToTextTask({
          // case: true, // or params can be set for every captcha specially
          body: base64Image
        },
          function (err, taskId) {
            if (err) {
              reject(err)
            }

            console.log("taskId", taskId);

            anticaptcha.getTaskSolution(taskId, function (err, taskSolution) {
              if (err) {
                reject(err)
              }
              resolve(taskSolution)

            });
          }
        );
      }
    });

  });
}


module.exports = router;
