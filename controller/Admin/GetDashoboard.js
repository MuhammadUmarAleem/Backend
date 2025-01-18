const User = require("../../models/User"); // Import User model
const Seller = require("../../models/Seller"); // Import Seller model
const mongoose = require("mongoose");
const PlanAssignment = require("../../models/PlanAssignment"); // Import PlanAssignment model

const GetDashboard = async (req, res) => {
  try {
    // 1. Get the last 7 time intervals (3 hours apart)
    const now = new Date();
    const timeIntervals = Array.from(
      { length: 7 },
      (_, i) => new Date(now.getTime() - i * 3 * 60 * 60 * 1000)
    ).reverse();

    // 2. Get the top 5 countries by registration count, considering seller information
    const topCountries = await User.aggregate([
      {
        $lookup: {
          from: "sellers", // Join with the Seller model
          localField: "_id", // Match _id of User
          foreignField: "userId", // Match userId of Seller
          as: "sellerInfo", // Store result in sellerInfo array
        },
      },
      {
        $unwind: {
          path: "$sellerInfo",
          preserveNullAndEmptyArrays: true, // Keep users who are not sellers
        },
      },
      {
        $project: {
          country: {
            $ifNull: [
              "$sellerInfo.country", // Get country from sellerInfo
              "Unknown", // Default to 'Unknown' if no country
            ],
          },
        },
      },
      {
        $group: {
          _id: "$country", // Group by country
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // Sort by highest count
      { $limit: 5 }, // Limit to top 5 countries
    ]);

    // 3. For each of the top 5 countries, get user registration counts in the last 7 intervals
    const countryRegistrationStats = await Promise.all(
      topCountries.map(async (countryStat) => {
        const country = countryStat._id;
        let totalCountryCount = 0; // To store total count for the country

        const registrationStats = await Promise.all(
          timeIntervals.map(async (time) => {
            const startTime = new Date(time);
            const endTime = new Date(time.getTime() + 3 * 60 * 60 * 1000); // End of the 3-hour interval

            let count = 0;

            if (country === "Unknown") {
              // Match users with their seller information for country matching
              count = await User.countDocuments({
                createdAt: { $gte: startTime, $lt: endTime }, // Filter by time range
              });
            } else {
              // Match users with their seller information for country matching
              count = await Seller.countDocuments({
                createdAt: { $gte: startTime, $lt: endTime }, // Filter by time range
                country: country, // Match the country from sellerInfo
              });
            }

            totalCountryCount += count;

            return { time: startTime, count };
          })
        );

        return {
          country,
          stats: registrationStats,
          totalCount: totalCountryCount, // Store the total count for this country
        };
      })
    );

    // 4. Calculate the total registrations across all countries
    const totalRegistrations = countryRegistrationStats.reduce(
      (acc, countryStat) => {
        return (
          acc + countryStat.stats.reduce((sum, stat) => sum + stat.count, 0)
        );
      },
      0
    );

    // 5. Calculate the percentage for each country
    const countryPercentages = countryRegistrationStats.map((countryStat) => {
      const totalCount = countryStat.totalCount;
      const percentage =
        totalRegistrations > 0 ? (totalCount / totalRegistrations) * 100 : 0;
      return {
        country: countryStat.country,
        percentage: percentage.toFixed(2), // Round to 2 decimal places
      };
    });

    // 6. Get subscription statistics for the previous 2-hour intervals
    const subscriptionIntervals = Array.from(
      { length: 10 },
      (_, i) => new Date(now.getTime() - (i + 1) * 2 * 60 * 60 * 1000)
    ); // Adjusted for previous intervals
    const subscriptionStats = await Promise.all(
      subscriptionIntervals.map(async (intervalStart) => {
        const intervalEnd = new Date(
          intervalStart.getTime() - 2 * 60 * 60 * 1000
        ); // Define the end of the interval (2 hours before the start)
        const subscriptionCount = await PlanAssignment.countDocuments({
          assignedAt: { $gte: intervalEnd, $lt: intervalStart }, // Use intervalStart and intervalEnd for 2-hour difference
        });

        return {
          time: intervalStart,
          subscriptionCount,
        };
      })
    );

    // 7. Send the response with the statistics for each country, percentage, and subscription stats
    res.status(200).json({
      success: true,
      data: {
        countryRegistrationStats,
        countryPercentages,
        subscriptionStats,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching registration stats by country:",
      error.message
    );
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { GetDashboard };
