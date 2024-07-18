const { connection } = require("../utils/database");

async function CreateTicket(req, response) {
  const ProjectId = req.body.ProjectId;
  const EmployeeId = req.body.EmployeeId;
  const Taskname = req.body.Taskname;
  const Duedate = req.body.Duedate;
  const Priority = req.body.Priority;
  const Status = req.body.Status;
  const Details = req.body.Details;

  const data = {
    ProjectId: ProjectId,
    EmployeeId: EmployeeId,
    Taskname: Taskname,
    Duedate: Duedate,
    Priority: Priority,
    Status: Status,
    Details: Details,
  };

  connection.query('SELECT * FROM Tickets WHERE Taskname = ? AND ProjectId = ?', [Taskname, ProjectId], (err, res) => {
    if (err) throw err;
    else {
      if (res.length === 0) {
        connection.query('INSERT INTO Tickets SET ?', data, (err, res) => {
          if (err) throw err;
          else {
            response.status(200).json({ message: 'created' });
          }
        });
      } else {
        response.status(200).json({ message: 'already' });
      }
    }
  });
}

module.exports = {
  CreateTicket,
};
