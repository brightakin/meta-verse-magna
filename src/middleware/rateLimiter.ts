const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 100, // limit each IP/user to 100 requests per windowMs
  //   keyGenerator: function (req) {
  //     return req.user.id; // use user ID as the key
  //   },
  handler: function (req: any, res: any, next: any) {
    res.status(429).json({
      message: "Too many requests, please try again later.",
    });
  },
});

module.exports = limiter;
