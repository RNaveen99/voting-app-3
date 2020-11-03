// const debug = require('debug')('try');

function addToDB() {
  const XLSX = require("xlsx");
  const uuid = require("uuid/v4");
  const { addUser } = require("./src/controllers/helpers/mongo")();

  const workbook = XLSX.readFile("electionEmailIDs.xlsx");
  let first_sheet_name = workbook.SheetNames[0];
  var worksheet = workbook.Sheets[first_sheet_name];

  // let address_of_cell = "B10";
  for (let i = 3; i <= 110; i++) {
    let srno = worksheet[`A${i}`].v;
    let name = worksheet[`B${i}`].v;
    let roll = worksheet[`C${i}`].v;
    let email = worksheet[`D${i}`].v;
    let obj = {
      _id: email,
      srno,
      roll,
      name,
      password: uuid().substr(0, 8),
      voted: false,
      privileges: "user",
    };
    // debug(obj)
    addUser(obj)
      .then((res) => {})
      .catch((err) => {
        debug(err);
      });
  }
}

/* Find desired cell */
// var desired_cell = worksheet[address_of_cell];

/* Get the value */
// var desired_value = (desired_cell ? desired_cell.v : undefined);
// worksheet['E5'] = {};
// worksheet['E5'].v = "new value";

// XLSX.writeFile(workbook, 'file2.xlsx')
// debug(worksheet)
// const workbook2 = XLSX.readFile('file2.xlsx')
// debug(workbook2)
// XLSX.write('Hello', 'E5')
// for (let i = 0 ; desired_value !== undefined; i++) {

//     debug(`worksheet[A${i}],B${i},C${i},D${i} `)
// }
// for (let i = 0; i < data.Strings.length; i++) {
//  debug(data.Strings[i])
//  debug(data.Strings[i].t)
//  debug('----------------------------------------------')
//  debug('----------------------------------------------')
// }
// debug(data.Strings[3])
// debug(data.Strings[4])
// debug(data.Strings[5])
// let worksheet = data.Sheets['Sheet1']
// let b = XLSX.utils.sheet_to_csv(worksheet)
// debug(typeof(b))
// const fs = require('fs')
// fs.writeFile('election.csv', b, (err) => {})
// let c = fs.readFileSync('election.csv', 'utf8')
// for (let i = 0; i < c.length; i++) {
// debug('------------------------------------')
// }
// let worksheet = data.Sheets['Sheet1']
// let cell = worksheet['A5']
// debug(cell.v)

function sendEmail() {
  var nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dduc.techmarathon@gmail.com",
      pass: "dduc@TM2019",
    },
  });

  for (let i = 0; i < 10; i++) {
    let mailOptions = {
      from: "dduc.techmarathon@gmail.com",
      to: "naveenrohilla99@gmail.com",
      subject: "Testing Node Mailer",
      // text: `NodeMailer verified. Working correctly`,
      html: `<h1>Here is ur ${i}code</h1><p>cool</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}
