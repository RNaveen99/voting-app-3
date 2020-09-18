const express = require('express');
const debug = require('debug')('app:voteRoutes');
const { vote, voting, vBoardGet, vBoardPost, votingGet, votingPost } = require('../controllers/voteController.js')();
const { ifSignIn, ifSignInAdmin } = require('../controllers/helpers/restrictions')();

const voteRouter = express.Router();

const router = () => {
  // voteRouter
  //   .route('/')
  //   .all(ifSignIn)
  //   .get(vote)
  //   .post(voting);

  voteRouter
    .route('/vBoard')
    .all(ifSignInAdmin)
    .get(vBoardGet)
    .post(vBoardPost);

  voteRouter
    .route('/:electionName')
    .all(ifSignIn)
    .get(votingGet)
    .post(votingPost);

  return voteRouter;
}

module.exports = router;