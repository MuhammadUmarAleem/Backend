const { connection } = require("../utils/database");

async function UpdateProject(req, res) {
  const projectId = req.query.id;
  const {
    Title,
    TeamId,
    PMId,
    StartingDate,
    EndDate,
    Status,
    ProjectType,
    GitHubRepo,
    ClientName,
    ClientContact,
    ClientEmail,
    ClientCountry,
    Milestones
  } = req.body;

  try {
    // Update project details
    await updateProjectDetails(projectId, {
      Title,
      TeamId,
      PMId,
      StartingDate,
      EndDate,
      Status,
      ProjectType,
      GitHubRepo
    });

    // Update or create client details if provided
    if (ClientEmail) {
      let client = await getClientByEmail(ClientEmail);
      if (client) {
        await updateClientDetails(client.Id, {
          Name: ClientName,
          Contact: ClientContact,
          CountryName: ClientCountry
        });
      } else {
        let insertedClient = await createClient(ClientName, ClientContact, ClientEmail, ClientCountry);
        if (!insertedClient) {
          throw new Error("Failed to create client");
        }
        await linkClientToProject(projectId, insertedClient.insertId);
      }
    }

    // Update or create milestones if provided
    if (Milestones && Milestones.length > 0) {
      for (let milestone of Milestones) {
        milestone.ProjectId = projectId;
        await updateOrCreateMilestone(milestone);
      }
    }

    res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    console.error("Error in updateProject function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateProjectDetails(projectId, data) {
  return new Promise((resolve, reject) => {
    connection.query("UPDATE Projects SET ? WHERE Id = ?", [data, projectId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function getClientByEmail(email) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM Clients WHERE Email = ?", [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]); // Assuming email is unique, return the first result
      }
    });
  });
}

async function updateClientDetails(clientId, data) {
  return new Promise((resolve, reject) => {
    connection.query("UPDATE Clients SET ? WHERE Id = ?", [data, clientId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function createClient(name, contact, email, countryName) {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO Clients (Name, Contact, Email, CountryName, Active) VALUES (?, ?, ?, ?, ?)",
      [name, contact, email, countryName, 1],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
}

async function linkClientToProject(projectId, clientId) {
  return new Promise((resolve, reject) => {
    connection.query("UPDATE Projects SET ClientID = ? WHERE Id = ?", [clientId, projectId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function updateOrCreateMilestone(data) {
  const { Id, MilestoneName, StartingDate, EndingDate, MilestoneDetails, ProjectId } = data;

  return new Promise((resolve, reject) => {
    if (Id) {
      // Milestone ID exists, update it
      connection.query("UPDATE Milestones SET ? WHERE Id = ?", [data, Id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } else {
      // Milestone ID does not exist, create it
      connection.query("INSERT INTO Milestones SET ?", data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }
  });
}

module.exports = {
  UpdateProject,
};
