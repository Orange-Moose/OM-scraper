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

const updateConfig = (req, res) => {
  scraperConfig.interval = req.body.interval; // update loop interval
  scraperConfig.resetLoop = true; // triger clearInterval and re-launch
  res.json(scraperConfig.str);
};



//Endpoints
router.get('/', getHomePage);
router.get('/state', getStateData);
router.post('/update-config', updateConfig);





export default router;
