const debug = require('debug')('app:voteController');
const { extractElectionData } = require('./helpers/votingHelper')();
const { addElectionData, updateVotes, loadResults } = require('./helpers/mongo')();

const voteController = () => {
  
  const votingGet = async (req, res) => {
    const { electionName } = req.params;
    const result = await loadResults(electionName);
    res.render('voting', { user: req.user, result, electionName });
  };  

  const votingPost = async (req, res) => {
    if (!req.session.hasOwnProperty('data')) {
      const result = await loadResults(req.body.electionName);
      debug(result);
      debug(result.length);
      if (result.length !== 0) {
        debug('length == ', result.length);
        return res.redirect('/vote');
      }
      req.session.data = req.body;
      req.session.data.totalVoter = 0;
      const temp = extractElectionData(req.session.data);
      await addElectionData(req.session.data.electionName, temp, req.user._id);
    } else if (req.session.hasOwnProperty('data')) {
      try {
        //debug(req.body);
        req.session.data.totalVoter++;
        updateVotes(req.session.data, req);
      } catch (error) {
        debug('==============update Votes called==============');
        debug(error);
        debug('=========================================');
      }
    }
    res.render('voting', { data: req.session.data });
  };

  const vBoardGet = (req, res) => {
    res.render('vBoard');
  };

  const vBoardPost = async (req, res) => {
    const result = await loadResults(req.body.electionName);
    debug(result);
    debug(result.length);
    if (result.length !== 0) {
      debug('length == ', result.length);
      // collection already exists
      return res.redirect('vBoard');
    }
    // req.session.data = req.body;
    // req.session.data.totalVoter = 0;
    const electionData = req.body;
    debug(electionData)
    const initializedElectionData = extractElectionData(electionData);
    // delete electionData.submit;
    // electionData['_id'] = 'electionDetails';
    await addElectionData(electionData.electionName, initializedElectionData, req.user['_id']);
    res.redirect('/auth/profile');
  }
  return {
    votingGet,
    votingPost,
    vBoardGet,
    vBoardPost,
  };
};

module.exports = voteController;
