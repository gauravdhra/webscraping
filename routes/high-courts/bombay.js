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
    var li_Number = 3
    console.log("entered endpoint")

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })

    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });;

    await getBase64Image(page, li_Number, next).then((image) => {
      base64Image = image;
    }, err => {
      next(err);
    })

    console.log("jumpppp ")
    getCaptchText(base64Image).then(async (text) => {
      try {
        console.log("taskSolution", text);
        await page.type('input[name ="m_party"]', req.query.party_name)
        await page.type('#captcha_code', text)
        await page.click('input[name ="submit1"]')

        await page.waitForSelector('form[name ="casepfrm"]', { timeout: 60000 })

        const tableData = await extractDataTable('form[name ="casepfrm"]', page,2, 3)
        // const tableData = await page.evaluate(() => document.querySelector('form[name ="casepfrm"]').outerHTML);

        await browser.close();
        res.send({ listResponse: tableData.listResponse,headers:tableData.headers,message:"Result Found" })
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

router.get('/advocate', async function (req, res, next) {

  try {
    var base64Image = ""
    var li_Number = 2
    console.log("entered endpoint")

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })

    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });;

    await getBase64Image(page, li_Number, next).then((image) => {
      base64Image = image;
    }, err => {
      next(err);
    })

    getCaptchText(base64Image).then(async (text) => {
      try {
        console.log("taskSolution", text);
        await page.type('input[name ="m_adv"]', req.query.adv_name)
        await page.type('#captcha_code', text)
        await page.click('input[name ="submit1"]')

        await page.waitForSelector('form[name ="caseafrm"]', { timeout: 60000 })


        const tableData = await extractDataTable('form[name ="caseafrm"]', page,1, 2)

        await browser.close();

        res.send({ listResponse: tableData.listResponse,headers:tableData.headers,message:"Result Found" })

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
    var li_Number = 1
    console.log("entered endpoint")

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })

    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });;

    await getBase64Image(page, li_Number, next)

    await page.select('select[name ="m_yr"]', req.query.m_yr)
    await page.type('input[name ="m_no"]', req.query.m_no)

    await page.click('#submit1')



    // wait for captcha and submit form     
    await delay(300);

    await page.waitForSelector('#captchaimg')

    let imageElement = await page.$("#captchaimg");

    base64Image = await imageElement.screenshot({ encoding: "base64" });


    getCaptchText(base64Image).then(async (text) => {
      try {
        console.log("taskSolution", text);

        await page.type('#captcha_code', text)
        await page.click('#go')

        await page.waitForSelector('form[name ="casecfrm"]', { timeout: 60000 })

        const finalData = await page.evaluate(() => document.querySelector('form[name ="casecfrm"]').outerHTML);

        await browser.close();
        res.send({ table: finalData })
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





router.get('/cnr-number', async function (req, res, next) {

  try {
    var base64Image = ""
    var li_Number = 4
    console.log("entered endpoint")

    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })

    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });;

    await getBase64Image(page, li_Number, next).then((image) => {
      base64Image = image;
    }, err => {
      next(err);
    })

    getCaptchText(base64Image).then(async (text) => {
      try {
        console.log("taskSolution", text);
        await page.select('select[name ="m_yr"]', req.query.m_yr)
        await page.type('input[name ="m_no"]', req.query.m_no)
        await page.type('#captcha_code', text)
        await page.click('input[name ="submit1"]')

        await page.waitForSelector('form[name ="casepfrm"]', { timeout: 60000 })

        const finalData = await page.evaluate(() => document.querySelector('form[name ="casepfrm"]').outerHTML);

        await browser.close();
        res.send({ table: finalData })
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

async function getBase64Image(page, li_Number, next) {

  return new Promise(async function (resolve, reject) {
    try {

      var getToUrl = URL.BOMBAY_HOME

      await page.setDefaultNavigationTimeout(0);

      page.goto(getToUrl)
      await page.waitForSelector('#smoothmenu2')

      await page.hover("#smoothmenu2 ul li:nth-child(2)")

      await delay(300);

      page.click(`#smoothmenu2 ul li:nth-child(2) ul li:nth-child(${li_Number})`)

      await page.waitForSelector('input[name ="submit1"]')

      if (li_Number == 1) {
        resolve("")
      }

      await delay(2000);

      await page.waitForSelector('#captchaimg')

      let imageElement = await page.$("#captchaimg");

      let base64Image = await imageElement.screenshot({ encoding: "base64" });

      resolve(base64Image)
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

  $('#' + tableId + ' thead tr').find('th').each(function (index) {
    let text = $(this).text().trim();
    headers.push(text)
  })
  $('#' + tableId + ' tbody tr').each(function (row) {
    let rowItems = []

    $(this).find('td').each(function (index) {
      let text = $(this).text().trim();
      rowItems.push(text)
    });
    listResponse.push(rowItems)
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



async function extractDataTable(element, page,headerTableNo, dataTableNo) {

  let $ = cheerio.load(await page.evaluate(() => document.body.innerHTML));

  console.log('5')
  var listResponse = [];
  var headers = []

  $(element).find('table').each(function (tableIndex) {
    console.log(tableIndex)

    let rowItems = []
    if (tableIndex >= dataTableNo){
      $(this).find("tbody tr:nth-child(1)").find('td').each(function (index) {
        console.log(index)
        if (index == 0 || index == 4) return;
        
        let text = $(this).text().trim();
        rowItems.push(text)
        
      })
      listResponse.push(rowItems)
      return;
    }

    if (tableIndex >= headerTableNo){
      $(this).find("tbody tr:nth-child(1)").find('td').each(function (index) {
        if (index == 0 || index == 4) return;
          let text = $(this).text().trim();
          headers.push(text)
      })
    }

  })


  return { listResponse, headers }
}

module.exports = router;
