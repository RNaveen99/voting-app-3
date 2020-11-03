const express = require('express');
const debug = require('debug')('app:resultRoutes');
const { ifSignIn, ifSignInAdmin } = require('../controllers/helpers/restrictions')();
const { loadResults, findAllUser } = require('../controllers/helpers/mongo')();
const nodemailer = require('nodemailer');

const resultRouter = express.Router();

async function sendEmail(users) {
  const msg = [];
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dduc.techmarathon@gmail.com",
      pass: "dduc@TM2019",
    },
  });
  users = [{_id:'naveenrohilla99@gmail.com', password:'Hello'},{_id:'naveenrohilla99@gmail.com', password:'World'}]
  for (let i = 0; i < users.length; i++) {
    const mailOptions = {
      from: "dduc.techmarathon@gmail.com",
      to: `${users[i]._id}`,
      subject: "Login Credentials for Sanganika Election Portal",
      // text: `NodeMailer verified. Working correctly`,
      html: `<h1>Login credentials are as follows:</h1><br> <h3>Email: ${users[i]._id}</h3><h3>Password: ${users[i].password}</h3> <h4>Note:Login credentials are case sensitive. </h4>`,
    };

    msg.push(transporter.sendMail(mailOptions).then(info => [info.envelope.to, info.response] ).catch(err => err))
  }
  return Promise.all(msg)
}


function router() {
  resultRouter
    .route('/')
    .all(ifSignInAdmin)
    .get((req, res) => {
      const { elections } = req.user;
      res.render('results', { elections });
    })
    .post((req, res) => {
      const { ename } = req.body;
      (async function results() {
        const result = await loadResults(ename);
        res.render('electionResults', { result });
      }());
    });
  resultRouter
    .route('/emails')
    .all(ifSignInAdmin)
    .get(async (req, res) => {
      const users = await findAllUser();
      const msg = await sendEmail(users);
      res.write(`${msg}`)
      res.end()
    })
  return resultRouter;
}

module.exports = router;


