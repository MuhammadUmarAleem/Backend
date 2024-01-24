const strftime = require("strftime");
const { connection } = require("../utils/database");

async function updateUser(req, response) {
  try {
    const username = req.query.username;
    const name = req.query.name;
    const surname = req.query.surname;
    const email = req.query.email;
    const address = req.query.address;
    const refnumber = req.query.refnumber;
    const id = req.query.id;


    console.log(username,name,surname,email,address,refnumber,id)

    connection.query(`UPDATE users
    SET username = '${username}', name = '${name}',surname = '${surname}',email = '${email}',address = '${address}',refnumber = '${refnumber}'
    WHERE id = ${id};
    `, (err, res) => {
      if (err) {
        return response.status(500).json({ message: "Internal Server Error" });
      }
      else {
        return response.status(200).json({ message: "updated" });
      }
    });
  } catch (error) {
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
    updateUser,
};
