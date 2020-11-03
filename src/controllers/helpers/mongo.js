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
  const updateVotes = async (electionName, result, body) => {
    const { client, db } = await createConnection();
    const col = db.collection(electionName);

    //  await updateEachPost(data);
    for (const obj of result) {
      let i = result.indexOf(obj)
      await updateEachPost(body, col, obj.post, i);
    }
    
    client.close();
  }
  const updateEachPost = async (body, col, post, i) => {
    for (const element of body.cName[i]) {
      const result = await col.updateOne(
        { post , 'candidates.cName': element },
        { $inc: { 'candidates.$.votes': 1 } },
      );
    }
  }
  
  const loadResults = async (ename) => {
    const { client, db } = await createConnection();
    const col = db.collection(ename);
    // debug(ename);
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
  const findAllUser = async () => {
    const { client, db } = await createConnection();
    const col = db.collection('users');
    const result = await col.find({ }).toArray();
    client.close();
    return result;
  }

  const updateVoted = async (email) => {
    let time = new Date()
    time = `${time.getHours()} : ${time.getMinutes()} : ${time.getSeconds()}`
    const { client, db } = await createConnection();
    const col = db.collection('users');
    const result = await col.updateOne({_id:email}, {$set:{voted:true, time }});
    client.close();
    return result;
  }

  return {
    addElectionData,
    updateVotes,
    loadResults,
    addUser,
    findUser,
    updateVoted,
    findAllUser,
  };
};

module.exports = mongoHelper;
