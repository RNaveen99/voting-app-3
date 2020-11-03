const express = require('express');
const debug = require('debug')('app:voteRoutes');
const { vBoardGet, vBoardPost, votingGet, votingPost, statusGet } = require('../controllers/voteController.js')();
const { ifSignIn, ifSignInAdmin } = require('../controllers/helpers/restrictions')();

const voteRouter = express.Router();

const router = () => {
  
  voteRouter
    .route('/vBoard')
    .all(ifSignInAdmin)
    .get(vBoardGet)
    .post(vBoardPost);

  voteRouter
    .route('/status')
    .all(ifSignInAdmin)
    .get(statusGet);

  voteRouter
    .route('/:electionName')
    .all(ifSignIn)
    .get(votingGet)
    .post(votingPost);

  return voteRouter;
}

module.exports = router;