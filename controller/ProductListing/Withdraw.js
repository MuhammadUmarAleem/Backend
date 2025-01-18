const Withdrawal = require('../../models/Withdrawal');
const Seller = require('../../models/Seller');
const axios = require('axios'); // For API calls to Escrow
const ESCROW_API_URL = 'https://api.escrow.com'; // Replace with actual Escrow API URL

const Withdraw = async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  let withdrawal; // Declare withdrawal outside try-catch so it can be accessed in catch block

  try {
    // Step 1: Fetch seller details
    const seller = await Seller.findOne({ userId });

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found.' });
    }

    // Step 2: Validate withdrawal amount
    if (amount > seller.walletBalance) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance.' });
    }

    // Step 3: Fetch card details
    const { cardHolderName, cardNumber, validDate, cvv } = seller;

    if (!cardHolderName || !cardNumber || !validDate || !cvv) {
      return res.status(400).json({ success: false, message: 'Incomplete card details.' });
    }

    // Step 4: Create a withdrawal record
    withdrawal = await Withdrawal.create({
      userId,
      amount,
      status: 'Pending',
    });

    // Step 5: Call Escrow API to process the withdrawal
    const escrowResponse = await axios.post(
      `${ESCROW_API_URL}/withdraw`,
      {
        amount,
        cardDetails: { cardHolderName, cardNumber, validDate, cvv },
        referenceId: withdrawal._id, // Pass withdrawal ID for tracking
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ESCROW_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Step 6: Update withdrawal record and wallet balance
    const { transactionId, status } = escrowResponse.data;

    withdrawal.status = status === 'success' ? 'Success' : 'Failed';
    withdrawal.transactionId = transactionId;
    withdrawal.updatedAt = new Date();
    await withdrawal.save();

    if (status === 'success') {
      seller.walletBalance -= amount; // Deduct the amount from wallet balance
      await seller.save();
    }

    // Step 7: Send response
    res.status(200).json({
      success: true,
      message: 'Withdrawal processed successfully.',
      data: withdrawal,
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);

    // Update withdrawal status to Failed in case of error (if withdrawal exists)
    if (withdrawal) {
      await Withdrawal.findByIdAndUpdate(withdrawal._id, { status: 'Failed' });
    }

    res.status(500).json({ success: false, message: 'Withdrawal failed. Please try again later.' });
  }
};

module.exports = { Withdraw };
