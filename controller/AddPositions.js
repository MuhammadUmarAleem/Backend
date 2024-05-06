const { connection } = require("../utils/database");

async function AddPositions(req, response) {
  const UserId = req.query.UserId;
  const Assets = req.query.Assets;
  const ProfitLoose = req.query.ProfitLoose;
  const EntryPoint = req.query.EntryPoint;
  const Size = req.query.Size;
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
        });
}

module.exports = {
  AddPositions,
};
