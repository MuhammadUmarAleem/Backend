const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connection } = require("../utils/database");

function GenerateToken(user) {
  const payload = {
    Email: user.Email,
    Role: user.Role,
    Id: user.Id,
  };
  const token = jwt.sign(payload, "123456asdfghjkljasjdhgasdyt6rt2376tuasgd");
  return token;
}

async function Login(req, response) {
  const Email = req.body.Email;
  const Password = crypto
    .createHash("sha256")
    .update(req.body.Password)
    .digest("hex");

  connection.query(
    `
    SELECT Id,Email,FirstName,LastName,Role FROM Users 
    WHERE Email='${Email}' AND Password='${Password}' and Active = true
    `,
    (err, res) => {
      if (err) throw err;
      else {
        if (res.length === 0) {
          return response.status(200).json({ message: "invalid" });
        } else {
          connection.query(
            `SELECT ProfileImage FROM Employees 
    WHERE UserId = ${res[0].Id}
          `,
            (err, resp) => {
              if (err) {
                console.log(err);
                return;
              } else {
                var token = GenerateToken(res);
                return response.status(200).json({
                  useremail: res[0].Email,
                  userrole: res[0].Role,
                  userprofile: resp[0].ProfileImage,
                  username: res[0].FirstName + " " + res[0].LastName,
                  jsonwebtoken: token,
                });
              }
            }
          );
        }
      }
    }
  );
}

module.exports = {
  Login,
};
