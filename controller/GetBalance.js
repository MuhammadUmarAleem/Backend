const { connection } = require("../utils/database");

async function GetBalance(req, response) {
    const UserId = req.query.UserId;
    try {
        connection.query(
            `SELECT * 
            FROM Users 
            WHERE Users.Id = ${UserId}`, // Using userId in the query
            (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    return response.status(200).json({ data: res });
                }
            }
        );
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    GetBalance,
};
