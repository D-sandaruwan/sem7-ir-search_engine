import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import router from "./src/functions";

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use("/app", router);
app.get("/", (req, res) => res.send("Welcome to Backend of Search Engine!"));

app.listen(port, () =>
  console.log(`Backend server is listening at http://localhost:${port}`)
);
