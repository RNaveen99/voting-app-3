const debug = require('debug')('app:votingHelper');

const votingHelper = () => {

  const extractElectionData = (electionData) => {
    const temp = [];
    electionData.post.forEach((post) => {
      const postIndex = electionData.post.indexOf(post);
      const perPostcandidates = [];
      electionData.candidateName[postIndex].forEach((candidate) => {
        perPostcandidates.push({ cName: candidate, votes: 0 });
      });
      const obj = {
        post,
        candidates: perPostcandidates,
        votingLimit: electionData.votingLimit[postIndex],
      };
      // obj.post = post;
      // obj.candidates = c;
      temp.push(obj);
    });
    debug('==========temp===================');
    debug(temp);
    debug('==========temp===================');
    
    return temp;
  }

  return {
    extractElectionData,
  };
};

module.exports = votingHelper;
