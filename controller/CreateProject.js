const { connection } = require("../utils/database");

async function CreateProject(req, res) {
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
    // Check if client already exists or create a new client
    let clientId;
    if (ClientEmail) {
      let existingClient = await getClientByEmail(ClientEmail);
      if (existingClient) {
        clientId = existingClient.Id;
      } else {
        // Insert new client into Clients table
        let insertedClient = await createClient(ClientName, ClientContact, ClientEmail, ClientCountry);
        if (insertedClient) {
          clientId = insertedClient.insertId;
        } else {
          throw new Error("Failed to create client");
        }
      }
    }

    // Insert project details into Projects table
    let projectData = {
      Title,
      TeamId,
      PMId,
      StartingDate,
      EndDate,
      Status,
      ProjectType,
      GitHubRepo,
      ClientID: clientId,
      Active: 1
    };

    let insertedProject = await createProject(projectData);
    if (!insertedProject) {
      throw new Error("Failed to create project");
    }

    // Insert milestones into Milestones table (if provided)
    if (Milestones && Milestones.length > 0) {
      for (let milestone of Milestones) {
        milestone.ProjectId = insertedProject.insertId;
        await createMilestone(milestone);
      }
    }

    res.status(200).json({ message: "Project created successfully" });
  } catch (error) {
    console.error("Error in CreateProjectWithClientAndMilestones function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
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

async function createProject(data) {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO Projects SET ?", data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function createMilestone(data) {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO Milestones SET ?", data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = {
  CreateProject,
};
