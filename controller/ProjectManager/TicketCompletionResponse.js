const {  User } = require('../../models/Users');
const { Ticket } = require('../../models/Tickets');
const { transporter } = require("../../utils/nodemailer");

async function TicketCompletionResponse(req, res) {
  const { Id, Status } = req.body;
  let State = null;

  // Logging input data
  console.log("Received data:", { Id, Status });

  // Validate the status
  if (Status !== 'Approved' && Status !== 'Rejected') {
    return res.status(400).json({ message: 'Invalid status' });
  }

  if (Status === 'Approved') {
    State = 'Completed';
  }
  if (Status === 'Rejected') {
    State = 'In progress';
  }

  try {
    // Update the ticket status
    const [updated] = await Ticket.update({ Status: State }, { where: { Id } });

    if (updated) {
      // Manually join the tables by querying the Ticket and User separately
      const ticket = await Ticket.findOne({ where: { Id } });

      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }

      const user = await User.findOne({ where: { Id: ticket.EmployeeId } });

      if (!user) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      const { Taskname: TicketName } = ticket;
      const { FirstName, LastName, Email } = user;

      // Send email notification to employee
      const mailOptions = {
        from: process.env.EMAIL,
        to: Email,
        subject: 'Ticket Completion Response',
        text: `Dear ${FirstName} ${LastName},

Your completion request for the ticket “[${TicketName}]” has been ${Status === 'Approved' ? 'Accepted' : 'Rejected'}.

Regards,
ResoSyncer Team`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      return res.status(200).json({ message: 'Ticket Updated and email sent' });
    } else {
      return res.status(404).json({ message: 'Ticket Not Found' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  TicketCompletionResponse,
};
