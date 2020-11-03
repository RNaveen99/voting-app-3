const debug = require('debug')('app:voteController');
const { extractElectionData } = require('./helpers/votingHelper')();
const { addElectionData, updateVotes, loadResults, updateVoted, findAllUser } = require('./helpers/mongo')();

const voteController = () => {
  
  const votingGet = async (req, res) => {
    const { electionName } = req.params;
    const result = await loadResults(electionName);
    res.render('voting', { user: req.user, result, electionName });
  };  

  const votingPost = async (req, res) => {
    // debug('voting post started')
    // debug(req.body)
    // debug(result)
    // debug('updatevote started')
    const { electionName } = req.params;
    if (! req.user.voted) {
      const result = await loadResults(electionName);
      await updateVoted(req.user._id)      
      await updateVotes(electionName, result, req.body)
    }
    // debug('updatevote ended')
    // debug('updatevoted started')

    // debug('finished----------------------')
    res.redirect(`${electionName}`)
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

  const statusGet = async (req, res) => {
    const users = await findAllUser();
    res.render('status', { users })
  }
  return {
    votingGet,
    votingPost,
    vBoardGet,
    vBoardPost,
    statusGet,
  };
};

module.exports = voteController;
