import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });
import sendSMS from './twilio.js';

let state = {
  urlCount: 0,
  lastcheck: false,
  date: '',
  urlList: [],
  newUrls: [],
};

// TO-DO set config parameters
let confing = {};





const getWebsiteData = async (url = 'https://orange-moose.com/') => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  let allData = [];
  let pagesToOpen = 2;

  pagesToOpen = await page.evaluate(() => {
    // Note: (not-usable) selector from another project
    const nextBtn = document.querySelector('#auctionitems .pagination ul li.nextpage');
    if (nextBtn) return 2;
    return 0;
  });

  if (pagesToOpen) {
    while (pagesToOpen != 0) {

      const data = await page.evaluate(() => {
        let urlList = [];
        const items = document.querySelectorAll('nav ul li a');

        items.forEach(item => {
          urlList.push(item.href);
        });
        return urlList;
      });

      const [response] = await Promise.all([
        page.waitForNavigation(),
        // Note: (not-usable) selector from another project
        page.click('#auctionitems .pagination ul li.nextpage'),
      ]);

      allData = allData.concat(data);
      --pagesToOpen;
    }
  } else {
    const data = await page.evaluate(() => {
      let urlList = [];
      const items = document.querySelectorAll('nav ul li a');

      items.forEach(item => {
        urlList.push(item.href);
      });
      return urlList
    });

    allData = data;
  }

  await browser.close();
  return allData;
};

const updateState = (newData) => {
  // Update the state
  state.urlCount = newData.length;
  state.urlList = newData;
  state.lastcheck = Date.now();
  state.date = new Date().toString().slice(4, 24);
};



const countUniqueUrls = (curList, newList) => {
  let uniqueUrls;
  // check only if the newList is bigger than the curList
  if (curList.length > 0) {
    uniqueUrls = newList.filter(url => !curList.includes(url));
  } else {
    uniqueUrls = [];
  }

  state.newUrls = uniqueUrls;
  return uniqueUrls;
};


// Format notification message
const createMessage = (state) => {
  return `New projects: ${state.newUrls.length}. Links:\n ${state.newUrls.join('\n')}`;
};


const runNewCheck = async () => {

  const newUrlList = await getWebsiteData();
  const uniqueUrlList = await countUniqueUrls(state.urlList, newUrlList);
  updateState(newUrlList);

  // Notify client if there are new urls in the state
  if (uniqueUrlList.length > 0) {
    const msg = createMessage(state);
    sendSMS(msg);
  }

  console.log(`Last check: ${state.date}, urlCount: ${state.urlCount}, new URLs: ${state.newUrls.length}`);
  
  return state;
};

runNewCheck();

setInterval(() => {
  runNewCheck();
}, 1000 * 30);


export { runNewCheck, state };