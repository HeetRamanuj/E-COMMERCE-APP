require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());

// app.use(bodyParser.json({
//     extended: true
// }))
// app.use(bodyParser.urlencoded({
//     extended: true
// }))

const port = 7000;

mongoose.connect(process.env.MONGOURL).then(() => {
  console.log("MongoDB Connected... 💖");
});

const adminRouter = require("./routes/Admin/adminRoute");
const userRouter = require("./routes/EndUsers/userRoute");

app.use("/admin", adminRouter);
app.use("/users", userRouter);

app.get("/", (req, res) => {
  console.log("Welcome = ");
  return res.status(200).send("Welcome");
});

app.listen(port, () => {
  console.log(`Server Running On Port No. :- ${port} 😻`);
});
