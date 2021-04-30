require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { sequelize } = require("./models");
const errorMiddleware = require("./middlewares/error");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/login");
app.post("/register");

app.use("/admin", adminRoute);
app.use("/user", userRoute);

app.use((req, res, next) => {
  res.status(400).json({ message: "Path not found." });
});

app.use(errorMiddleware);
// sequelize.sync({ force: true }).then(() => console.log("DB Sync"));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
