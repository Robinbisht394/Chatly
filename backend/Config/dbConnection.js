const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected sucessfully");
  } catch (err) {
    console.log({
      code: "DB_CONNECTION_FAILED",
      error: { message: err.message },
    });
  }
};

module.exports = { dbConnection };
