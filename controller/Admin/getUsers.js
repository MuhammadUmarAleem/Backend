const { connection } = require("../../utils/database");
const logs = require('../Admin/log');
async function GetUsers(req, response) {
  try{
  connection.query("SELECT  * from users where active = true", (err, res) => {
    if (err) {
      logs.log(err,'Admin','/getusers');
      return;
    }
    else {
      return response.status(200).json({ data: res });
    }
  });
}catch(err){
  logs.log(err,'Admin','/getusers');
}
}

module.exports = {
  GetUsers,
};
