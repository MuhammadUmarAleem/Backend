const { connection } = require("../utils/database");

async function GetPositions(req, response) {
    const UserId = req.query.UserId;
    try {
        connection.query(
            `SELECT Positions.Id, Positions.Position 
            FROM Positions 
            WHERE Positions.UserId = ${UserId}`, // Using userId in the query
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
    GetPositions,
};
