import express from 'express';
const router = express.Router();
import { scraperConfig, state, runNewCheck } from './scrape.js';


const getHomePage = async (req, res) => {
  let state = await runNewCheck();
  res.render('index', { state, scraperConfig });
};

const getStateData = async (req, res) => {
  res.json(state);
};

const getConfigData = async (req, res) => {
  res.json(scraperConfig.interval);
};

const updateConfig = (req, res) => {
  scraperConfig.interval = req.body.interval;
  scraperConfig.resetLoop = true;
  res.json(scraperConfig.interval);
};

//Endpoints
router.get('/', getHomePage);
router.get('/state', getStateData);
router.get('/config', getConfigData);
router.post('/update-config', updateConfig);





export default router;
