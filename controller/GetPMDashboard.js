const { connection } = require("../utils/database");

async function GetPMDashboard(req, response) {
  try {
    const { id } = req.query;

    if (!id) {
      return response.status(400).json({ error: 'Employee ID is required' });
    }

    // Fetch project stats for the PM
    connection.query(
      `SELECT 
         COUNT(*) as totalProjects,
         SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) as completedProjects,
         SUM(CASE WHEN Status = 'In Progress' THEN 1 ELSE 0 END) as inProgressProjects
       FROM Projects
       WHERE PMId = ?`,
      [id],
      (err, projectRes) => {
        if (err) {
          console.log(err);
          return response.status(500).json({ error: 'Database query error' });
        } else {
          console.log('Project Query Result:', projectRes);
          const { totalProjects, completedProjects, inProgressProjects } = projectRes[0];

          return response.status(200).json({
            totalProjects,
            completedProjects,
            inProgressProjects
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  GetPMDashboard,
};
