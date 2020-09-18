const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:mongoHelper');

const mongoHelper = () => {
  const url = 'mongodb://localhost:27017';
  const dbName = 'voting';

  const createConnection = async () => {
    debug('request for connection sent');
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    debug('request for connection accepted');
    return { client, db };
  };

  const addElectionData = async (electionName, initializedElectionData, userId) => {
    const { client, db } = await createConnection();
    const col1 = db.collection(electionName);
    const result1 = await col1.insertMany(initializedElectionData);
    // const result2 = await col1.insertOne(electionData);
    const col2 = db.collection('users');
    const result3 = await col2.updateOne(
      { _id: userId },
      { $push: { elections: electionName } },
    );
    client.close();
  }
  const updateVotes = async (data, req) => {
    let c;
    try {
      const { client, db } = await createConnection();
      c = client;
      const col = db.collection(data.electionName);
  
      //  await updateEachPost(data);
      for (const post of data.post) {
        await updateEachPost(data, req, col, post);
      }
    } catch (error) {
      debug('==============update Votes==============');
      debug(error);
      debug('=========================================');
    }
    c.close();
  }
  const updateEachPost = async (data, req, col, post) => {
    try {
      const i = data.post.indexOf(post);
      for (const element of req.body.cName[i]) {
        debug('=============element======================');
        debug(element);
        debug('=========================================');
        let result = await col.updateOne(
          { title: post , 'candidates.cName': element },
          { $inc: { 'candidates.$.votes': 1 } },
        );
        debug('--------------update each post--------------');
        debug(result.result);
        debug('--------------update each post--------------');
      }
    } catch (error) {
      debug('==============update Each Post==============');
      debug(error);
      debug('=========================================');
    }
  }
  
  const loadResults = async (ename) => {
    const { client, db } = await createConnection();
    const col = db.collection(ename);
    debug(ename);
    const result = await col.find({}).toArray();
    client.close();
    return result;
  }

  const addUser = async (userAccount) => {
    const { client, db } = await createConnection();
    const col = db.collection('users');
    const result = await col.insertOne(userAccount);
    client.close();
    return result;
  }
  const findUser = async (email) => {
    const { client, db } = await createConnection();
    const col = db.collection('users');
    const result = await col.findOne({
      _id: email,
    });
    client.close();
    return result;
  }
  return {
    addElectionData,
    updateVotes,
    loadResults,
    addUser,
    findUser,
  };
};

module.exports = mongoHelper;
