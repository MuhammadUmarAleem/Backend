const { connection } = require("../utils/database");

async function GetDashboard(req, response) {
  try {
    const userQuery = `
      SELECT 
        SUM(CASE WHEN Role = 'Employee' THEN 1 ELSE 0 END) AS Employees,
        SUM(CASE WHEN Role = 'ProjectManager' THEN 1 ELSE 0 END) AS ProjectManagers,
        SUM(CASE WHEN Role = 'Admin' THEN 1 ELSE 0 END) AS Admins
      FROM Users;
    `;

    const projectQuery = `
      SELECT 
        SUM(CASE WHEN Status = 'Not Started Yet' THEN 1 ELSE 0 END) AS ProjectsNotCompletedYet,
        SUM(CASE WHEN Status = 'In Progress' THEN 1 ELSE 0 END) AS ProjectsInProgress,
        SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) AS ProjectsCompleted
      FROM Projects;
    `;

    const salaryQuery = `
      SELECT 
        SUM(Salary) AS CompletedSalaries
      FROM Employees;
    `;

    const teamQuery = `
     SELECT 
    Count(*) AS Team
    FROM Teams
    WHERE Active = 1
    GROUP BY Active;

    `;

    const [userResults, projectResults, salaryResults, teamResults] = await Promise.all([
      new Promise((resolve, reject) => {
        connection.query(userQuery, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      }),
      new Promise((resolve, reject) => {
        connection.query(projectQuery, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      }),
      new Promise((resolve, reject) => {
        connection.query(salaryQuery, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      }),

      new Promise((resolve, reject) => {
        connection.query(teamQuery, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      }),
    ]);

    return response.status(200).json({
      Employees: userResults[0].Employees,
      ProjectManagers: userResults[0].ProjectManagers,
      Admins: userResults[0].Admins,
      ProjectsNotCompletedYet: projectResults[0].ProjectsNotCompletedYet,
      ProjectsInProgress: projectResults[0].ProjectsInProgress,
      ProjectsCompleted: projectResults[0].ProjectsCompleted,
      CompletedSalaries: salaryResults[0].CompletedSalaries,
      Teams: teamResults[0].Team,
    });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  GetDashboard,
};
