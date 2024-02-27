const { connection } = require("../../utils/database");
const logs = require('../Admin/log');

async function GetDashboard(req, response) {
  try{
  let brands = 0;
  let users = 0;
  let products = 0;
  let orders = 0;
  let revenue = 0;

  connection.query(
    `SELECT
    a.active,
    COALESCE(COUNT(u.active), 0) as count
FROM
    (SELECT 0 as active UNION SELECT 1 as active) a
LEFT JOIN
    instructor u ON a.active = u.active
GROUP BY
    a.active
ORDER BY
    a.active ASC;

`,
    (err, res) => {
      if (err) {
        logs.log(err,'Admin','/getDashboard');
        return;
      }
      else {
        instructor = res;
        connection.query(
          `SELECT
          a.active,
          COALESCE(COUNT(u.active), 0) as count
      FROM
          (SELECT 0 as active UNION SELECT 1 as active) a
      LEFT JOIN
          course u ON a.active = u.active
      GROUP BY
          a.active
      ORDER BY
          a.active ASC;
      `,
          (err, res) => {
            if (err) {
              logs.log(err,'Admin','/getDashboard');
              return;
            }
            else {
              course = res;
              connection.query(
                `SELECT
                a.active,
                COALESCE(COUNT(u.active), 0) as count
            FROM
                (SELECT 0 as active UNION SELECT 1 as active) a
            LEFT JOIN
                users u ON a.active = u.active
              WHERE role = 'User'
            GROUP BY
                a.active
            ORDER BY
                a.active ASC;
            
            `,
                (err, res) => {
                  if (err) {
                    logs.log(err,'Admin','/getDashboard');
                    return;
                  }
                  else {
                    users = res;
                    return response.status(200).json({
                      instructor: instructor,
                      course: course,
                      users: users,
                    });
                    // connection.query('SELECT * FROM inventory',(err,res)=>{
                    //     if(err) throw err;
                    //     else{
                    //         products=res.length;
                    //         connection.query('SELECT SUM(total) as Total from orders',(err,res)=>{
                    //             if(err) throw err;
                    //             else{
                    //                 revenue=res[0].Total;
                    //                 return response.status(200).json({brands:brands,users:users,products:products,orders:orders,revenue:revenue});
                    //             }
                    //         })
                    //     }
                    // })
                  }
                }
              );
            }
          }
        );
      }
    }
  );
  }catch(err){
    logs.log(err,'Admin','/getDashboard');
  }
}

module.exports = {
  GetDashboard,
};
