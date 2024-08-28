const { connection } = require("../../utils/database");

async function GetDashboard(req, response) {
  try {
    connection.query(
      `SELECT 
         (SELECT COUNT(*) FROM users WHERE role = 0) AS total_users, 
         (SELECT COUNT(*) FROM users WHERE DATE(createdAt) = CURDATE() AND role = 0) AS today_users, 
         ROUND((SELECT COUNT(*) FROM users WHERE DATE(createdAt) = CURDATE() AND role = 0) / (SELECT COUNT(*) FROM users WHERE role = 0) * 100, 2) AS percentage_today,
         (SELECT COUNT(*) FROM event WHERE DATE(createdAt) = CURDATE()) AS today_events,
         ROUND((SELECT COUNT(*) FROM event WHERE DATE(createdAt) = CURDATE()) / (SELECT COUNT(*) FROM event) * 100, 2) AS today_events_per,
         (SELECT COUNT(*) FROM users WHERE role = 1) AS active_admins
       FROM dual`,  // Use `dual` to ensure the query executes correctly
      (err, res) => {
        if (err) {
          console.log(err);
          return response.status(500).json({ error: "Database query error" });
        } else {
          const data = {
            total_users: res[0].total_users,
            today_users: res[0].today_users,
            percentage_today: res[0].percentage_today,
            today_events: res[0].today_events,
            today_events_per: res[0].today_events_per,
            active_admins: res[0].active_admins,
          };
          return response.status(200).json({ data });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  GetDashboard,
};
