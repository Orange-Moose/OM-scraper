import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });
import sendSMS from './twilio.js';

// Scraper data
let state = {
  urlCount: 0,
  lastcheck: false,
  date: '',
  urlList: [],
  newUrls: [],
};

// Scraper config
let scraperConfig = {
  interval: 20,
  resetLoop: false,
  loopId: null
};

const getWebsiteData = async (url = 'https://orange-moose.com/') => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  let allData = [];

  const data = await page.evaluate(() => {
    let urlList = [];
    const items = document.querySelectorAll('nav ul li a');

    items.forEach(item => {
      urlList.push(item.href);
    });
    
    return urlList;
  });
  
  allData = data;
  await browser.close();
  return allData;
};

const updateState = (newData) => {
  state.urlCount = newData.length;
  state.urlList = newData;
  state.lastcheck = Date.now();
  state.date = new Date().toString().slice(4, 24);
};



const countUniqueUrls = (curList, newList) => {
  let uniqueUrls;
  
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


const runScraper = () => {  
  scraperConfig.loopId = setInterval(() => {
    if (scraperConfig.resetLoop) return resetScraper();
      console.log('Running scraper');
      runNewCheck();
    }, 1000 * scraperConfig.interval);
};

const resetScraper = () => {
  console.log('Reseting scraper');
  scraperConfig.resetLoop = false;
  clearInterval(scraperConfig.loopId);
  scraperConfig.loopId = null;
  return runScraper();
};

runScraper();

export { scraperConfig, runNewCheck, state };