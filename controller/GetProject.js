const { connection } = require("../utils/database");

async function GetProject(req, response) {
  try {
    const Id = req.query.id
    connection.query(
      `Select * from Projects Where Id = ${Id} and Active = true `,
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        } else {
            if (res.length === 0) {
                return response.status(200).json({ message: "Project Not Exist" });
              }
              else{
                connection.query(
                    `Select Distinct Milestones.* from Projects Join Milestones On Projects.Id = Milestones.ProjectId Where Projects.Id = ${Id}
                  `,
                    (err, resp) => {
                      if (err) {
                        console.log(err);
                        return;
                      } else {
                        connection.query(
                            `Select Distinct Clients.* from Projects Join Clients On Clients.Id = Projects.ClientID Where Projects.Id = ${Id}
                          `,
                            (err, respo) => {
                              if (err) {
                                console.log(err);
                                return;
                              } else {
                                connection.query(
                                    `Select Distinct Users.*, Employees.* from Projects Join Tickets On Tickets.ProjectId = Projects.Id Join Employees ON Tickets.EmployeeId = Employees.Id Join Users ON Users.Id = Employees.UserId Where Projects.Id = ${Id}
                                  `,
                                    (err, respon) => {
                                      if (err) {
                                        console.log(err);
                                        return;
                                      } else {
                                          return response.status(200).json({ Project: res, Milestones: resp, Client: respo, Employees:respon });
                                      }
                                    }
                                  );
                              }
                            }
                          );
                      }
                    }
                  );
                }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  GetProject,
};
