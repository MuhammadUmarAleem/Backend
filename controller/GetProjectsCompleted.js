const { connection } = require("../utils/database");

async function GetProjectsCompleted(req, res) {
  const { type, duration } = req.query;

  if (!type || !duration) {
    return res.status(400).json({ message: "Type and duration are required in the request body" });
  }

  let query;
  let periods;

  if (type === 'Month') {
    periods = duration.split(',').map(month => month.trim());
    query = `
      SELECT 
        DATE_FORMAT(EndDate, '%b') AS Period, 
        COUNT(*) AS ProjectCount
      FROM Projects
      WHERE DATE_FORMAT(EndDate, '%b') IN (?)
      AND Status = 'Completed'
      GROUP BY DATE_FORMAT(EndDate, '%b')
    `;
  } else if (type === 'Year') {
    periods = duration.split(',').map(year => year.trim());
    query = `
      SELECT 
        DATE_FORMAT(EndDate, '%Y') AS Period, 
        COUNT(*) AS ProjectCount
      FROM Projects
      WHERE DATE_FORMAT(EndDate, '%Y') IN (?)
      AND Status = 'Completed'
      GROUP BY DATE_FORMAT(EndDate, '%Y')
    `;
  } else {
    return res.status(400).json({ message: "Invalid type. Must be 'Month' or 'Year'" });
  }

  // Execute the query
  connection.query(query, [periods], (err, results) => {
    if (err) {
      console.error("Error in GetProjectsCompleted function:", err);
      return res.status(500).json({ message: "Internal server error" });
    } else {
      // Prepare response object with all periods initialized to 0
      const response = periods.reduce((acc, period) => {
        acc[period] = 0;
        return acc;
      }, {});

      // Populate counts from query results
      results.forEach(result => {
        response[result.Period] = result.ProjectCount;
      });

      return res.status(200).json(response);
    }
  });
}

module.exports = {
  GetProjectsCompleted,
};
