const { addUser, findUser } = require('../controllers/helpers/mongo')();
const bcrypt = require('bcrypt');

const authController = () => {

  const signUpPost = async (req, res) => {
    const { name, roll, email, password } = req.body;
    const userAccount = {
      _id: email,
      name,
      roll,
      password,
      voted: false,
      allowed: false,
      privileges: 'user',
    };
    (async function signUp() {
      let results = await findUser(email);
      if (!results) {
        bcrypt.hash(userAccount.password, 10, (err, hash) => {
          userAccount.password = hash;
          addUser(userAccount).then((results) => {
            delete results.ops[0].password;
            // delete results.ops[0].allowed;
            // delete results.ops[0].voted;

            req.login(results.ops[0], () => {
              return res.redirect('/auth/profile');
            });
          }).catch((err) => {
            res.redirect('/auth/signIn');
          });
        });        
      } else {
        res.redirect('/auth/signIn');
      }
    }());
  }
  return {
    signUpPost,
  }
}

module.exports = authController;