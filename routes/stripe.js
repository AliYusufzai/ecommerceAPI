const router = require("express").Router();
// const Stripe = require("stripe")(process.env.STRIPE_KEY);

const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51NHAjsKz9UEAUpd2w81dQGPjp6AG6LjRafcwfkhiwflLZlcyK9nSbRbIHdVcMCyjCF0Jw6YSEAhALpJgB4aPzp2S0075YEDIYD"
);

router.post("/payment", async (req, res) => {
  try {
    await stripe.charges.create(
      {
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd"
      },
      (stripeErr, stripeRes) => {
        if (stripeErr) {
          res.status(500).json(stripeErr);
          console.error("Stripe error", stripeErr);
        } else {
          res.status(200).json(stripeRes);
        }
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
