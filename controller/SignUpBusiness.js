const strftime = require("strftime");
const crypto = require("crypto");
const { connection } = require("../utils/database");
const { serialize } = require("cookie");

async function SignUpBusiness(req, response) {
  const company = req.body.company;
  const founder = req.body.founder;
  const email = req.body.email;
  const password = crypto
  .createHash("sha256")
  .update(req.body.password)
  .digest("hex");
  const personalnote = req.body.personalnote;
  const compantdetails = req.body.companydetails;
  const websiteurl = req.body.websiteurl;
  const founded = req.body.founded;
 
  const now = new Date();
  const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

  const data = {
    company: company,
    founder: founder,
    email: email,
    password: password,
    personalnote: personalnote,
    compantdetails: compantdetails,
    websiteurl: websiteurl,
    founded: founded,
    createdAt: dateCreated,
    updatedAt: dateCreated,
    active: true,
  };

  connection.query(
    `SELECT * FROM companies WHERE email='${email}' or company = '${company}'`,
    (err, res) => {
      if (err) throw err;
      else {
        if (res.length == 0) {
          connection.query("INSERT INTO companies SET ?", data, (err, res) => {
            if (err) throw err;
            else {
              response.status(200).json({ message: [email] });
            }
          });
        } else {
          response.status(200).json({ message: "already" });
        }
      }
    }
  );
}

module.exports = {
  SignUpBusiness,
};
