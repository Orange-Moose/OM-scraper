import express from 'express';
const router = express.Router();
import { state, runNewCheck } from './scrape.js';



const getHomePage = async (req, res) => {
  let state = await runNewCheck();
  res.render('index', { state });
};

const getStateData = async (req, res) => {
  res.json(state);
};







//Endpoints
router.get('/', getHomePage);
router.get('/state', getStateData);






export default router;
