const { connection } = require("../../utils/database");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const logs = require("../Admin/log");

async function buyProduct(req, response) {
  try {
    const productId = req.body.productId;
    const userId = req.body.userId;
    const price = req.body.price;
    const image = req.body.image;

    console.log(productId, userId, price, image);

    connection.query(
      `SELECT * FROM course WHERE id=${productId}`,
      async (err, res) => {
        if (err) {
          logs.log(err, "user", "/buyProduct");
          return;
        } else {
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
              {
                price_data: {
                  currency: "pkr",
                  product_data: {
                    name: "Product",
                    // images: [`http://localhost:5000/images/${image}`],
                  },
                  unit_amount: price * 100,
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: `http://localhost:5000/buy?session_id={CHECKOUT_SESSION_ID}&courseId=${productId}&userId=${userId}&price=${price}`,
            cancel_url: "http://localhost:3000/cancel",
          });
          console.log("Session Response:", session);
          response.status(200).json({ sessionUrl: session.url });
        }
      }
    );
  } catch (err) {
    logs.log(err, "user", "/buyProduct");
  }
}

module.exports = {
  buyProduct,
};
