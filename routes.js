import express from 'express';
const router = express.Router();
import { scraperConfig, state, runNewCheck } from './scrape.js';



const getHomePage = async (req, res) => {
  let state = await runNewCheck();
  res.render('index', { state });
};

const getStateData = async (req, res) => {
  res.json(state);
};

const updateConfig = (req, res) => {
  console.log(req.body);
  // if(val && typeof(val) == 'number')  scraperConfig.interval = val;
  res.json(req.body);
};






//Endpoints
router.get('/', getHomePage);
router.get('/state', getStateData);
router.post('/update-config', updateConfig(50));





export default router;
