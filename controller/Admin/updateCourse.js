const jwt = require("jsonwebtoken");
const strftime = require("strftime");
const { connection } = require("../../utils/database");
const logs = require('../Admin/log');

async function updateInventory(req, response) {
  try {
    const name = req.body.name;
    const price = req.body.price;
    const stock = req.body.stock;
    const description = req.body.description;
    const brand = req.body.brand;
    const id = req.query.id;
    const now = new Date();
    const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);
    let oldValue = {};

    connection.query(`SELECT * FROM course WHERE id=${id}`, (err, res) => {
      if (err) {
        logs.log(err,'Admin','/updateCourse');
        return;
      }
      else {
        oldValue = res[0];
        connection.query(
          "INSERT INTO course_audit (userid, action, oldValue, newValue,dated) VALUES (?, ?, ?, ?,?)",
          [
            2,
            "UPDATE",
            JSON.stringify(oldValue),
            JSON.stringify({
              name: name,
              price: price,
              description: description,
              brand: brand,
            }),
            dateCreated,
          ],
          (err, auditResult) => {
            if (err) {
              logs.log(err,'Admin','/updateCourse');
              return;
            }else {
              const brandQuery = `SELECT * FROM instructor WHERE instructorName = ?`;

              connection.query(brandQuery, [brand], (err, brandResult) => {
                if (err) {
                  console.error("Error selecting brand:", err);
                  return response
                    .status(500)
                    .json({ message: "Internal Server Error" });
                }

                if (brandResult.length === 0) {
                  return response
                    .status(404)
                    .json({ message: "Instructor not found" });
                }

                const updateQuery = req.file
                  ? `UPDATE course SET name=?, image=?, price=?, description=?, instructorId=?, updatedAt=? WHERE id=?`
                  : `UPDATE course SET name=?, price=?, description=?, instructorId=?, updatedAt=? WHERE id=?`;

                const updateParams = req.file
                  ? [
                      name,
                      req.file.filename,
                      price,
                      description,
                      brandResult[0].id,
                      dateCreated,
                      id,
                    ]
                  : [
                      name,
                      price,
                      description,
                      brandResult[0].id,
                      dateCreated,
                      id,
                    ];

                connection.query(
                  updateQuery,
                  updateParams,
                  (err, updateResult) => {
                    if (err) {
                      console.error("Error updating inventory:", err);
                      return response
                        .status(500)
                        .json({ message: "Internal Server Error" });
                    }
                    return response.status(200).json({ message: "updated" });
                  }
                );
              });
            }
          }
        );
      }
    });
  } catch (error) {
    logs.log(err,'Admin','/updateCourse');
    console.error("Unhandled error:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  updateInventory,
};
