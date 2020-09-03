var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
const puppeteer = require('puppeteer')
const { Proxy } = require("../../constants/courts-url");
const dropdown = require("./json-data/district-dropdwon-data.json");

const { AntiCaptcha } = require("../../constants/courts-url");
var anticaptcha = require('../../anticaptcha/anticaptcha')(AntiCaptcha.key);


router.get('/dropdown', async function (req, res, next) {
  try {
    res.send({ dropdown: dropdown });
  }
  catch (err) {
    next(err)
  }
})

router.get('/party', async function (req, res, next) {

  try {
    var base64Image = ""
    console.log("entered endpoint")

    const browser = await puppeteer.launch({ headless: false, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })

    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });;
    await page.setViewport({ width: 1280, height: 800 })

    var getToUrl = await getUrl(req.query.stateId, req.query.districtId, 'party')

    await getBase64Image(page, getToUrl, next).then((image) => {
      base64Image = image;
    }, err => {
      next(err);
    })

    console.log("jumpppp ")
    getCaptchText(base64Image,browser).then(async (text) => {
      try {
        console.log("taskSolution", text);
        await page.select('#court_complex_code', req.query.court_complex_code)
        await page.type('#petres_name', req.query.petres_name)
        await page.type('#rgyear', req.query.rgyear)
        await page.type('#captcha', text)

        await page.click('input[name ="submit1"]')

        // Now see which one appeared:
        try {
          await page.waitForSelector("#showList3 tbody tr", { timeout: 30000 });

          const tableData = await extractDataFromTable("showList3", page);

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

router.get('/advocate', async function (req, res, next) {

  try {
    var base64Image = ""
    console.log("entered endpoint")

    const browser = await puppeteer.launch({ headless: false, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })

    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });;
    await page.setViewport({ width: 1280, height: 800 })

    var getToUrl = await getUrl(req.query.stateId, req.query.districtId, 'advocate')

    await getBase64Image(page, getToUrl, next).then((image) => {
      base64Image = image;
    }, err => {
      next(err);
    })


    getCaptchText(base64Image,browser).then(async (text) => {
      try {
        console.log("taskSolution", text);

        await page.select('#court_complex_code', req.query.court_complex_code)
        await page.type('#advocate_name', req.query.advocate_name)
        await page.type('#captcha', text)

        await page.click('input[name ="submit1"]')

        // Now see which one appeared:
        try {

          await page.waitForSelector("#showList3 tbody tr", { timeout: 30000 });

          const tableData = await extractDataFromTable("showList3", page);

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
    console.log("entered endpoint")

    const browser = await puppeteer.launch({ headless: false, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })

    const page = await browser.newPage()
    await page.authenticate({
      username: Proxy.username,
      password: Proxy.password
    });;
    await page.setViewport({ width: 1280, height: 800 })

    var getToUrl = await getUrl(req.query.stateId, req.query.districtId, 'case')

    await getBase64Image(page, getToUrl, next).then((image) => {
      base64Image = image;
    }, err => {
      next(err);
    })


    getCaptchText(base64Image,browser).then(async (text) => {
      try {
        console.log("taskSolution", text);
        await page.select('#court_complex_code', req.query.court_complex_code)
        // await page.select('#case_type', req.query.case_type)
        await page.type('#search_case_no', req.query.search_case_no)
        await page.type('#rgyear', req.query.rgyear)
        await page.type('#captcha', text)



        await page.click('input[name ="submit1"]')

        // Now see which one appeared:
        try {
          await page.waitForSelector("#showList #titlehid tbody tr", { timeout: 30000 });

          const tableData = await extractDataFromTable("titlehid", page);

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





router.get('/cnr-number', async function (req, res, next) {

  try {
    var base64Image = ""
    var li_Number = 4
    console.log("entered endpoint")

    const browser = await puppeteer.launch({ headless: false, args: [`--proxy-server=http://${Proxy.IP}:${Proxy.port}`, '--no-sandbox'] })

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

    getCaptchText(base64Image,browser).then(async (text) => {
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

async function getBase64Image(page, getToUrl, next) {

  return new Promise(async function (resolve, reject) {
    try {

      await page.setDefaultNavigationTimeout(0);

      page.goto(getToUrl, { "waitUntil": "networkidle0" })

      await page.waitForSelector('input[name ="submit1"]',{timeout:60000})

      await delay(1000);

      await page.waitForSelector('#captcha_image')

      let captchaImage = await page.$("#captcha_image ");

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


async function getUrl(stateId, districtId, search) {
  switch (search) {
    case 'party':
      return `https://services.ecourts.gov.in/ecourtindia_v4_bilingual/cases/ki_petres.php?state=D&state_cd=${stateId}&dist_cd=${districtId}`

    case 'advocate':
      return `https://services.ecourts.gov.in/ecourtindia_v4_bilingual/cases/qs_civil_advocate.php?state=D&state_cd=${stateId}&dist_cd=${districtId}`

    case 'case':
      return `https://services.ecourts.gov.in/ecourtindia_v4_bilingual/cases/case_no.php?state=D&state_cd=${stateId}&dist_cd=${districtId}`

  }
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
function getCaptchText(base64Image,browser) {
  return new Promise(function (resolve, reject) {

    anticaptcha.getBalance(async function (err, balance) {
      if (err) {
        await browser.close();
        reject(err)
      }

      // captcha params can be set here
      // anticaptcha.setMinLength(5);

      if (balance > 0) {
        anticaptcha.createImageToTextTask({
          // case: true, // or params can be set for every captcha specially
          body: base64Image
        },
          async function (err, taskId) {
            if (err) {
              await browser.close();
              reject(err)
            }

            console.log("taskId", taskId);

            anticaptcha.getTaskSolution(taskId, async function (err, taskSolution) {
              if (err) {
                await browser.close();
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
