const { connection } = require("../utils/database");

async function UpdateEmployee(req, res) {
  const { Email, FirstName, LastName, Position, DOJ, Salary, CNIC, HomeAddress, GitHubUsername, BankAccountName, BankAccountNo } = req.body;
  const Id = req.query.id
  const file = req.file;
  var ProfileImage = null
    if (!file) {
      ProfileImage = null
    }
    else{
      ProfileImage = file.path;
    }

  const checkUserQuery = "SELECT * FROM Users WHERE Email = ? AND Id <> ?";
  connection.query(checkUserQuery, [Email, Id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const updateUserQuery = `
      UPDATE Users
      SET Email = ?, FirstName = ?, LastName = ?
      WHERE Id = ? AND Role = 'Employee';
    `;
    connection.query(updateUserQuery, [Email, FirstName, LastName, Id], (err, userResult) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (userResult.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found or unauthorized" });
      }

      if(!file){
        const updateEmployeeQuery = `
        UPDATE Employees
        SET Position = ?, DOJ = ?, Salary = ?, CNIC = ?, HomeAddress = ?, GitHubUsername = ?, BankAccountName = ?, BankAccountNo = ?
        WHERE UserId = ?;
      `;
        connection.query(updateEmployeeQuery, [Position, DOJ, Salary, CNIC, HomeAddress, GitHubUsername, BankAccountName, BankAccountNo,Id], (err, empResult) => {
          if (err) {
            // Rollback the user update if employee update fails
            connection.query(updateUserQuery, [req.body.Email, req.body.FirstName, req.body.LastName, req.body.PhoneNo, req.body.Id], (err) => {
              if (err) {
                console.error("Failed to rollback user update:", err);
              }
            });
            return res.status(500).json({ error: err.message });
          }
  
          if (empResult.affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found" });
          }
  
          res.status(200).json({ message: "User and employee updated successfully" });
        });
      }
      else{
        const updateEmployeeQuery = `
        UPDATE Employees
        SET Position = ?, DOJ = ?, Salary = ?, CNIC = ?, HomeAddress = ?, GitHubUsername = ?, BankAccountName = ?, BankAccountNo = ?, ProfileImage = ?
        WHERE UserId = ?;
      `;
        connection.query(updateEmployeeQuery, [Position, DOJ, Salary, CNIC, HomeAddress, GitHubUsername, BankAccountName, BankAccountNo, ProfileImage, Id], (err, empResult) => {
          if (err) {
            // Rollback the user update if employee update fails
            connection.query(updateUserQuery, [req.body.Email, req.body.FirstName, req.body.LastName, req.body.PhoneNo, req.body.Id], (err) => {
              if (err) {
                console.error("Failed to rollback user update:", err);
              }
            });
            return res.status(500).json({ error: err.message });
          }
  
          if (empResult.affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found" });
          }
  
          res.status(200).json({ message: "User and employee updated successfully" });
        });
      }
      
    });
  });
}

module.exports = {
  UpdateEmployee,
};
