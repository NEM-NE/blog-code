const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const nunjucks = require("nunjucks");

const indexRouter = require("./routes");

dotenv.config();

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("view engine", "html");

nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번에서 대기 중`);
});

app.use("/", indexRouter);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});
