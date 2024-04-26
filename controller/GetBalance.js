const { connection } = require("../utils/database");

async function GetBalance(req, response) {
    const BotId = req.query.BotId;
    try {
        connection.query(`SELECT Users.Id FROM Users JOIN Bot ON Bot.UserId = Users.Id WHERE Bot.Id=${BotId}`, (err, res) => {
            if (err) throw err;
            else {
                if (res.length != 0) {
                    const userId = res[0].Id; // Extracting userId from the result
                    connection.query(
                        `SELECT * 
                        FROM Users 
                        WHERE Users.Id = ${userId}`, // Using userId in the query
                        (err, res) => {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                return response.status(200).json({ data: res });
                            }
                        }
                    );
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    GetBalance,
};
