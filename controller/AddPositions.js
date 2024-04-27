const { connection } = require("../utils/database");

async function AddPositions(req, response) {
  const BotId = req.query.BotId;
  const Assets = req.query.Assets;
  const ProfitLoose = req.query.ProfitLoose;
  const EntryPoint = req.query.EntryPoint;
  const Size = req.query.Size;
  connection.query(`SELECT Users.Id FROM Users Join Bot On Bot.UserId = Users.Id WHERE Bot.Id=${BotId}`, (err, res) => {
    if (err) throw err;
    else {
      if (res.length != 0) {
        var UserId = res[0].Id
        connection.query(`
        SELECT Max(Position) AS Count
        FROM Positions
        WHERE UserId = ${UserId};
        `, (err, respo) => {
            if (err) throw err;
            else {
              var Position = 0
              console.log(respo[0].Count)
              if(respo[0].Count === null){
                Position = 0
              }
                const data = {
                    UserId: UserId,
                    Assets: Assets,
                    ProfitLoss: ProfitLoose,
                    EntryPoint: EntryPoint,
                    Size: Size,
                    Position: Position + 1,
                  };
                console.log(data)
                connection.query("INSERT INTO Positions SET ?", data, (err, res) => {
                      if (err) throw err;
                      else {
                        response.status(200).json({ message: "okay" });
                      }
                    });
            }
        }); // <-- Added closing parenthesis here
      } else {
        response.status(200).json({ message: "already" });
      }
    } // <-- Added closing parenthesis here
  });
}

module.exports = {
  AddPositions,
};
